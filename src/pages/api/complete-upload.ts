import { NextApiRequest, NextApiResponse } from 'next'
import { S3 } from 'aws-sdk'

export const config = {
  api: {
    bodyParser: true,
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
  const { key, parts, UploadId } = req.body

  const s3 = new S3({
    endpoint: ENV.endpoint,
    s3ForcePathStyle: true,
    region: ENV.region,
    credentials: {
      accessKeyId: ENV.accessKeyId,
      secretAccessKey: ENV.secretAccessKey
    }
  })

  try {
    await s3
      .completeMultipartUpload({
        Bucket: ENV.bucketName,
        Key: key as string,
        UploadId: UploadId as string,
        MultipartUpload: { Parts: parts }
      })
      .promise()
    res.status(200).json({
      msg: 'done'
    })
  } catch (error) {
    console.log(error)

    res.status(400).json({
      msg: 'fail'
    })
  }
}

export default POST
