import type { NextApiRequest, NextApiResponse } from 'next';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import formidable from 'formidable-serverless';
import * as fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (error: any, fields: any, files: any) => {
    if (error) {
      throw error;
    }

    const s3Client = new S3Client({
      // endpoint: process.env.NEXT_PUBLIC_FLOSTREAM_ENDPOINT,
      region: process.env.NEXT_PUBLIC_FLOSTREAM_REGION,
      credentials: {
        accessKeyId: fields.accessKeyId,
        secretAccessKey: fields.secretAccessKey,
      },
    });

    let path = files.file.path;
    let rawData = fs.readFileSync(path);

    await s3Client
      .send(
        new PutObjectCommand({
          Bucket: fields.bucketName,
          Key: files.file.name,
          Body: rawData,
          ContentType: files.file.type,
        })
      )
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(500).json({ message: error?.message });
      });
  });
}

export default POST;
