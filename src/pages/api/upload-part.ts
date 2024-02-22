import { S3 } from 'aws-sdk'
import formidable from 'formidable-serverless'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
}

const ENV = {
  accessKeyId: process.env.NEXT_PUBLIC_STORE_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.NEXT_PUBLIC_STORE_SECRET_ACCESS_KEY as string,
  region: process.env.NEXT_PUBLIC_STORE_REGION as string,
  bucketName: process.env.NEXT_PUBLIC_STORE_BUCKET as string,
  endpoint: process.env.NEXT_PUBLIC_STORE_ENDPOINT as string
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm({
    maxFileSize: 20 * 1024 * 1024 * 1024, // 20 GB
    allowEmptyFiles: false
  })

  const s3 = new S3({
    endpoint: ENV.endpoint,
    s3ForcePathStyle: true,
    region: ENV.region,
    credentials: {
      accessKeyId: ENV.accessKeyId,
      secretAccessKey: ENV.secretAccessKey
    }
  })

  form.parse(req, async (error: any, fields: any, files: any) => {
    if (error) {
      throw error
    }

    const chunkData = fs.readFileSync(files.file.path)

    const { partNumber, uploadId } = fields

    const params: AWS.S3.UploadPartRequest = {
      Body: chunkData,
      Bucket: ENV.bucketName,
      Key: files.file.name,
      PartNumber: Number(partNumber),
      UploadId: uploadId
    }

    try {
      const data = await s3.uploadPart(params).promise()
      res.status(200).json({ ...data, partNumber: Number(partNumber) })
    } catch (error) {
      console.log(error)

      res.status(400).json({ msg: 'fail' })
    }
  })
}

export default POST
