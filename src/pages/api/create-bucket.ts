import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const body = JSON.parse(req.body);

  const s3Client = new S3Client({
    endpoint: process.env.NEXT_PUBLIC_STORE_ENDPOINT,
    region: process.env.NEXT_PUBLIC_STORE_REGION,
    credentials: {
      accessKeyId: body.accessKeyId,
      secretAccessKey: body.secretAccessKey,
    },
  });

  await s3Client
    .send(new CreateBucketCommand({ Bucket: body.bucketName }))
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

export default POST;
