import type { NextApiRequest, NextApiResponse } from 'next';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const bodyFormData = req.body;

    let body: any = {};

    bodyFormData.forEach((value: any, key: any) => {
      body[key] = value;
    });

    const s3Client = new S3Client({
      endpoint: process.env.NEXT_PUBLIC_FLOSTREAM_ENDPOINT,
      region: process.env.NEXT_PUBLIC_FLOSTREAM_REGION,
      credentials: {
        accessKeyId: body.accessKeyId,
        secretAccessKey: body.secretAccessKey,
      },
    });

    const uploadFile = async () => {
      try {
        const response = await s3Client.send(
          new PutObjectCommand({
            Bucket: body.bucketName,
            Key: body.file.name,
            Body: body.file,
            ContentType: body.file.type,
          })
        );
        res.status(200).json(response);
      } catch (error: any) {
        res.status(500).json({ message: error?.message });
      }
    };

    uploadFile();
  } else {
    res.status(404).json({ message: 'API not found!' });
  }
}
