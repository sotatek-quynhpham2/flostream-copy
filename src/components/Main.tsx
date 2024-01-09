import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';

export const Main = () => {
  const router = useRouter().pathname;
  const [buckets, setBuckets] = useState([]);

  const [awsAccessKeyId, setAwsAccessKeyId] = useState(
    'SKEZ6znfei9avPnqorCQ3nqLws'
  );

  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState(
    'bb9fd7ee7925a0420a1b54105998ab0d69fb3b567aecb8d98338b8c4ff1ef762'
  );

  const getBuckets = () => {
    fetch('/api/list-buckets', {
      method: 'POST',
      body: JSON.stringify({
        awsAccessKeyId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBuckets(data.buckets);
      });
  };

  useEffect(() => {}, []);

  return (
    <div id="main" className="use-tailwind">
      <div className="flex gap-3 align-middle justify-center">
        <label>Access Key: </label>
        <input
          type="text"
          value={awsAccessKeyId}
          className="border border-gray-400 rounded"
          onChange={(e) => setAwsAccessKeyId(e.target.value)}
        ></input>
        <button
          onClick={() => getBuckets()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
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
              {buckets.map((bucket) => (
                <tr>
                  <td className="border px-4 py-2">{bucket?.local_alias}</td>
                  <td className="border px-4 py-2">
                    {bucket?.endpoint_url.split('.')[1]}
                  </td>
                  <td className="border px-4 py-2">
                    {moment(bucket?.updated_at).format('HH:mm DD/MM/YYYY')}
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
