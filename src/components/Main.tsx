import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';

export const Main = () => {
  const router = useRouter().pathname;
  const [buckets, setBuckets] = useState<any>([]);

  const [accessKeyId, setAccessKeyId] = useState<string>(
    'SKEZ6znfei9avPnqorCQ3nqLws'
  );

  const [secretAccessKey, setSecretAccessKey] = useState<string>(
    'bb9fd7ee7925a0420a1b54105998ab0d69fb3b567aecb8d98338b8c4ff1ef762'
  );

  const getBuckets = () => {
    fetch('/api/list-buckets', {
      method: 'POST',
      body: JSON.stringify({
        accessKeyId,
        secretAccessKey,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBuckets(data.Buckets);
      });
  };

  useEffect(() => {}, []);

  return (
    <div id="main" className="use-tailwind">
      <div className="">
        <div>
          <label>Access Key: </label>
          <input
            type="text"
            value={accessKeyId}
            className="border border-gray-400 rounded"
            onChange={(e) => setAccessKeyId(e.target.value)}
          ></input>
        </div>
        <div className="mt-2">
          <label>Secret Key: </label>
          <input
            type="text"
            value={secretAccessKey}
            className="border border-gray-400 rounded"
            onChange={(e) => setSecretAccessKey(e.target.value)}
          ></input>
        </div>
        <button
          onClick={() => getBuckets()}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Get Buckets
        </button>
      </div>
      <div className="flex align-middle justify-center mt-5">
        {buckets && (
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Region</th>
                <th className="px-4 py-2">Last modified</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((bucket: any) => (
                <tr key={bucket?.Name}>
                  <td className="border px-4 py-2">{bucket?.Name}</td>
                  <td className="border px-4 py-2">
                    { process.env.NEXT_PUBLIC_FLOSTREAM_REGION }
                  </td>
                  <td className="border px-4 py-2">
                    {moment(bucket?.CreationDate).format('HH:mm DD/MM/YYYY')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
