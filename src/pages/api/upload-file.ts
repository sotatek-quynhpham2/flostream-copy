import { S3Client } from '@aws-sdk/client-s3'
import { Progress, Upload } from '@aws-sdk/lib-storage'
import formidable from 'formidable-serverless'
import * as fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

export const progressUpload: { fileName: string; progress: Required<Progress>; timeStart: number }[] = []

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const accessKeyId = process.env.NEXT_PUBLIC_STORE_ACCESS_KEY_ID
  const secretAccessKey = process.env.NEXT_PUBLIC_STORE_SECRET_ACCESS_KEY

  let options = {
    maxFileSize: 20 * 1024 * 1024 * 1024, // 20 GB
    allowEmptyFiles: false
  }

  const form = new formidable.IncomingForm(options)

  form.parse(req, async (error: any, fields: any, files: any) => {
    if (error) {
      throw error
    }

    const s3Client = new S3Client({
      endpoint: process.env.NEXT_PUBLIC_STORE_ENDPOINT,
      region: process.env.NEXT_PUBLIC_STORE_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: accessKeyId as string,
        secretAccessKey: secretAccessKey as string
      }
    })

    let path = files.file.path
    let rawData = fs.readFileSync(path)

    try {
      const parallelUploads3 = new Upload({
        client: s3Client,
        params: { Bucket: process.env.NEXT_PUBLIC_STORE_BUCKET, Key: files.file.name, Body: rawData },
        tags: [
          /*...*/
        ], // optional tags
        queueSize: 10, // optional concurrency configuration
        partSize: 1024 * 1024 * 10, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false // optional manually handle dropped parts
      })

      parallelUploads3.on('httpUploadProgress', (progress) => {
        const index = progressUpload.findIndex((x) => x.fileName === files.file.name)
        if (index !== -1) {
          if (progress.loaded === progress.total) {
            progressUpload.splice(index, 1)
          } else {
            progressUpload[index].progress = progress as Required<Progress>
          }
        } else {
          progressUpload.push({
            fileName: files.file.name,
            progress: progress as Required<Progress>,
            timeStart: Date.now()
          })
        }
      })

      await parallelUploads3.done()
      res.status(200).json('done')
    } catch (e) {
      console.log({ e })
      res.status(500).json(e)
    }

    // await s3Client
    //   .send(
    //     new PutObjectCommand({
    //       Bucket: process.env.NEXT_PUBLIC_STORE_BUCKET,
    //       Key: files.file.name,
    //       Body: rawData,
    //       ContentType: files.file.type,

    //     })
    //   )
    //   .then((response) => {
    //     res.status(200).json(response);
    //   })
    //   .catch((error) => {
    //     res.status(500).json(error);
    //   });
  })
}

export default POST
