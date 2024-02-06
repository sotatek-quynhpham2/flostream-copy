import type { NextApiRequest, NextApiResponse } from 'next';
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import formidable from 'formidable-serverless';
import * as fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const accessKeyId = process.env.NEXT_PUBLIC_STORE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_STORE_SECRET_ACCESS_KEY;

  const expiresIn = 86400; // 24 hours

  let options = {
    maxFileSize: 20 * 1024 * 1024 * 1024, // 20 GB
    allowEmptyFiles: false,
  };

  const form = new formidable.IncomingForm(options);

  form.parse(req, async (error: any, fields: any, files: any) => {
    if (error) {
      throw error;
    }

    const s3Client = new S3Client({
      endpoint: process.env.NEXT_PUBLIC_STORE_ENDPOINT,
      region: process.env.NEXT_PUBLIC_STORE_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: accessKeyId as string,
        secretAccessKey: secretAccessKey as string,
      },
    });

    let path = files.file.path;
    let rawData = fs.readFileSync(path);

    await s3Client
      .send(
        new PutObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_STORE_BUCKET,
          Key: files.file.name,
          Body: rawData,
          ContentType: files.file.type,
        })
      )
      .then(async (response) => {
        // Create a presigned URL for the uploaded file.
        await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_STORE_BUCKET,
            Key: files.file.name,
          }),
          { expiresIn: expiresIn }
        )
          .then((response) => {
            res.status(200).json(response);
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });
}

export default POST;
