import type { NextApiRequest, NextApiResponse } from 'next';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const accessKeyId = process.env.NEXT_PUBLIC_STORE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_STORE_SECRET_ACCESS_KEY;

  const body = JSON.parse(req.body);

  const expiresIn = 172800; // 48 hours

  const s3Client = new S3Client({
    endpoint: process.env.NEXT_PUBLIC_STORE_ENDPOINT,
    region: process.env.NEXT_PUBLIC_STORE_REGION,
    credentials: {
      accessKeyId: accessKeyId as string,
      secretAccessKey: secretAccessKey as string,
    },
  });

  await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_STORE_BUCKET,
      Key: body.objectKey,
    }),
    { expiresIn: expiresIn }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

export default POST;
