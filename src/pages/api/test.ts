import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    axios.get ('https://jsonplaceholder.typicode.com/todos')
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
