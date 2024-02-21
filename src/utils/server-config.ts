'use server'

const ENV = {
  accessKeyId: process.env.NEXT_PUBLIC_STORE_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.NEXT_PUBLIC_STORE_SECRET_ACCESS_KEY as string,
  region: process.env.NEXT_PUBLIC_STORE_REGION as string,
  bucketName: process.env.NEXT_PUBLIC_STORE_BUCKET as string,
  endpoint: process.env.NEXT_PUBLIC_STORE_ENDPOINT as string
}

export default ENV
