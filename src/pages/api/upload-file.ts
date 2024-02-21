import ENV from '@/utils/server-config'
import { S3 } from 'aws-sdk'
import formidable from 'formidable-serverless'
import * as fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

const progressUpload: {
  fileName: string
  timeStart: number
  progress: {
    total: number
    loaded: number
  }
}[] = []

export const getProgress = () => progressUpload

function splitFile(filePath: string, chunkSize: number): Promise<Buffer[]> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let bytesRead = 0

    const readStream = fs.createReadStream(filePath, { highWaterMark: chunkSize })

    readStream.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
      bytesRead += chunk.length
    })

    readStream.on('end', () => {
      console.log(`File split into ${chunks.length} chunks`)
      resolve(chunks)
    })

    readStream.on('error', (err) => {
      reject(err)
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const s3 = new S3({
    endpoint: ENV.endpoint,
    s3ForcePathStyle: true,
    region: ENV.region,
    credentials: {
      accessKeyId: ENV.accessKeyId,
      secretAccessKey: ENV.secretAccessKey
    }
  })

  let options = {
    maxFileSize: 20 * 1024 * 1024 * 1024, // 20 GB
    allowEmptyFiles: false
  }

  const CHUNK_SIZE = 10 * 1024 * 1024 // 10MB
  const form = new formidable.IncomingForm(options)

  form.parse(req, async (error: any, fields: any, files: any) => {
    if (error) {
      throw error
    }

    const createUploadId = () =>
      new Promise<S3.CreateMultipartUploadOutput>((rel, rej) => {
        s3.createMultipartUpload(
          {
            Bucket: ENV.bucketName,
            Key: files.file.name,
            ContentType: files.file.type
          },
          (err, res) => {
            if (err) rej(err)
            rel(res)
          }
        )
      })

    const { UploadId } = await createUploadId()

    let indexMax = 0

    splitFile(files.file.path, CHUNK_SIZE)
      .then(async (chunks: Buffer[]) => {
        const promises = chunks.map(async (chunk: Buffer, index: number) => {
          const partNumber = index + 1
          const params: AWS.S3.UploadPartRequest = {
            Body: chunk,
            Bucket: ENV.bucketName,
            Key: files.file.name,
            PartNumber: partNumber,
            UploadId: UploadId as string
          }

          // Upload the part
          const data = await s3.uploadPart(params).promise()
          const indexExist = progressUpload.findIndex((x: any) => x.fileName === files.file.name)
          if (indexExist !== -1) {
            if (indexMax < index) {
              indexMax = index
            }
            progressUpload[indexExist].progress = {
              loaded: 10 * 1024 * 1024 * (indexMax + 1),
              total: files.file.size
            }
          } else {
            progressUpload.push({
              fileName: files.file.name,
              timeStart: Date.now(),
              progress: { loaded: 10 * 1024 * 1024, total: files.file.size }
            })
          }

          return { PartNumber: partNumber, ETag: data.ETag }
        })

        // Wait for all parts to be uploaded
        const parts = await Promise.all(promises)

        // Complete the multipart upload
        await s3
          .completeMultipartUpload({
            Bucket: ENV.bucketName,
            Key: files.file.name as string,
            UploadId: UploadId as string,
            MultipartUpload: { Parts: parts }
          })
          .promise()

        return res.status(200).json({ msg: 'upload file successfully' })
      })
      .catch((err) => {
        res.status(500).json({ err })
      })
  })
}

export default POST
