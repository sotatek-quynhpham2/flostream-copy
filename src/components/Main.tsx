import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { Button } from './Button';
import { Table } from './Table';
export const Main = ({ dataBuckets }: any) => {
  const router = useRouter().pathname;
  const [buckets, setBuckets] = useState<any>([]);

  const [accessKeyId, setAccessKeyId] = useState<string>(
    'AKIAQFPO2RESJQOEOV7L'
  );

  const [secretAccessKey, setSecretAccessKey] = useState<string>(
    'PTyW4KO6djtUVACvlK+vTo7qeFYsDCCXhW/rP8ub'
  );

  // const getBuckets = () => {
  //   sessionStorage.setItem('accessKeyId', accessKeyId);
  //   sessionStorage.setItem('secretAccessKey', secretAccessKey);

  //   fetch('/api/list-buckets', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       accessKeyId,
  //       secretAccessKey,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setBuckets(data.Buckets);
  //     });
  // };

  useEffect(() => {

  }, []);

  return (
    <div id="main" className="use-tailwind">
      <div className="container mx-auto">
        <div className="flex align-middle justify-center mt-5 min-h-[400px] border border-colorBorder">
          {dataBuckets && (
            <Table dataTable={dataBuckets} />
          )}
        </div>
      </div>
    </div>
  );
};
