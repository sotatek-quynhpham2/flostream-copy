import type { NextApiRequest, NextApiResponse } from 'next';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);

    const s3Client = new S3Client({
      endpoint: process.env.NEXT_PUBLIC_FLOSTREAM_ENDPOINT,
      region: process.env.NEXT_PUBLIC_FLOSTREAM_REGION,
      credentials: {
        accessKeyId: body.accessKeyId,
        secretAccessKey: body.secretAccessKey,
      },
    });

    const getFiles = async () => {
      try {
        const response = await s3Client.send(new ListObjectsV2Command({
          Bucket: body.bucketName,
        }));
        res.status(200).json(response);
      } catch (error: any) {
        res.status(500).json({message: error?.message});
      }
    };

    getFiles();
  }
  else {
    res.status(404).json({message: 'API not found!'});
  }
}