import type { NextApiRequest, NextApiResponse } from 'next';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const accessKeyId = process.env.NEXT_PUBLIC_STORE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_STORE_SECRET_ACCESS_KEY;

  const body = JSON.parse(req.body);

  const s3Client = new S3Client({
    endpoint: process.env.NEXT_PUBLIC_STORE_ENDPOINT,
    region: process.env.NEXT_PUBLIC_STORE_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: accessKeyId as string,
      secretAccessKey: secretAccessKey as string,
    },
  });

  await s3Client
    .send(
      new ListObjectsV2Command({
        Bucket: process.env.NEXT_PUBLIC_STORE_BUCKET,
      })
    )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

export default POST;
