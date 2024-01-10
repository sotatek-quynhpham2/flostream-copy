import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';

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
    
    const getBuckets = async () => {
      try {
        const response = await s3Client.send(new ListBucketsCommand({}));
        console.log(response);
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json(error);
      }
    };
    
    getBuckets();
  }
  else {
    res.status(404).json({message: 'API not found!'});
  }
}