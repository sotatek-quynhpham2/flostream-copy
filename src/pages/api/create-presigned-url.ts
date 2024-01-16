import type { NextApiRequest, NextApiResponse } from 'next';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const body = JSON.parse(req.body);

  const expiresIn = 86400; // 24 hours

  const s3Client = new S3Client({
    endpoint: process.env.NEXT_PUBLIC_STORE_ENDPOINT,
    region: process.env.NEXT_PUBLIC_STORE_REGION,
    credentials: {
      accessKeyId: body.accessKeyId,
      secretAccessKey: body.secretAccessKey,
    },
  });

  await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: body.bucketName, Key: body.objectKey }),
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
