import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    axios.get (`https://app.flo.stream/api/bucket/${body.awsAccessKeyId}?page=0&limit=10`)
    .then (response => {
      res.status(200).json(response.data);
    })
    .catch (error => {
      res.status(500).json(error);
    });
  }
  else {
    res.status(404).json({message: 'API not found!'});
  }
}