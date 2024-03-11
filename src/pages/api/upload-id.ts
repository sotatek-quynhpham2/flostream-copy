import { NextApiRequest, NextApiResponse } from 'next'
import { S3 } from 'aws-sdk'

interface getUploadIdApiRequest extends NextApiRequest {
  body: {
    fileName: string
    contentType?: string
  }
}

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
console.log("bucketName", ENV);


async function POST(req: getUploadIdApiRequest, res: NextApiResponse) {
  const { fileName, contentType } = req.body
  console.log("body", req.body);
  

  const s3 = new S3({
    endpoint: ENV.endpoint,
    s3ForcePathStyle: true,
    region: ENV.region,
    credentials: {
      accessKeyId: ENV.accessKeyId,
      secretAccessKey: ENV.secretAccessKey
    }
  })

  if (!fileName) {
    return res.status(400).json({
      msg: 'filename and contentType is required'
    })
  }
  
  await s3.createMultipartUpload(
    {
      Bucket: ENV.bucketName,
      Key: fileName,
      ContentType: contentType
    },
    (err, data) => {
      console.log("err", err);
      console.log("data", data);
      
      if (err) {
        return res.status(400).json({
          msg: 'filename and contentType is required'
        })
      }
      return res.status(200).json({
        data
      })
    }
  )
}

export default POST
