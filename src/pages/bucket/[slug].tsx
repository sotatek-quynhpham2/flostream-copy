import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { DefaultLayout as Layout } from '@/layouts/default';

import Image from 'next/image';
import ArrowBanckIcon from '@/assets/icons/arrow-back.svg';
import SearchOutlineIcon from '@/assets/icons/search-outline.svg';
import ReloadIcon from '@/assets/icons/reload.svg';
import UploadIcon from '@/assets/icons/upload.svg';
import axios from 'axios';

const Bucket: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [accessKeyId, setAccessKeyId] = useState<string>('');
  const [secretAccessKey, setSecretAccessKey] = useState<string>('');
  const [keySearch, setKeySearch] = useState<string>('');
  const [files, setFiles] = useState<any>([]);

  const [newFile, setNewFile] = useState<any>(undefined);

  const searchFiles = () => {
    console.log('searchFiles', keySearch);
  };

  const fetchFiles = () => {
    const accessKeyId = sessionStorage.getItem('accessKeyId');
    const secretAccessKey = sessionStorage.getItem('secretAccessKey');
    if (accessKeyId && secretAccessKey) {
      setAccessKeyId(accessKeyId);
      setSecretAccessKey(secretAccessKey);
      fetch('/api/list-files', {
        method: 'POST',
        body: JSON.stringify({
          accessKeyId,
          secretAccessKey,
          bucketName: slug,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('data', data);
          setFiles([]);
        });
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [slug]);

  useEffect(() => {
    if (newFile) {
      const accessKeyId = sessionStorage.getItem('accessKeyId');
      const secretAccessKey = sessionStorage.getItem('secretAccessKey');

      if (accessKeyId && secretAccessKey) {
        setAccessKeyId(accessKeyId);
        setSecretAccessKey(secretAccessKey);

        const formData = new FormData();
        formData.append('file', newFile);
        formData.append('accessKeyId', accessKeyId as string);
        formData.append('secretAccessKey', secretAccessKey as string);
        formData.append('bucketName', slug as string);

        fetch('/api/upload-file', {
          method: 'POST',
          body: formData
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('data', data);
            setNewFile(undefined);
          });
      } else {
        return;
      }
    }
  }, [newFile]);

  return (
    <Layout>
      <Head>
        <title>Flostream Storage</title>
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="description" content="Flostream Storage" />
      </Head>
      <div className="grid grid-col-12 px-12 py-8">
        <button
          onClick={() => router.back()}
          className="flex flex-row items-center gap-1"
        >
          <Image src={ArrowBanckIcon} height={14} alt="ArrowBanckIcon" />
          <span className="text-[#1F3832] font-medium text-[13px] leading-normal">
            Back
          </span>
        </button>
        <h2 className="mt-6 text-[#292929] font-bold text-[28px] leading-normal">
          {slug}
        </h2>
        <div className="mt-6 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Search files"
              className="border border-[#D7DCE0] rounded w-[300px] h-[36px] px-3 py-2 focus-visible:outline-none font-normal text-[#292929] text-[16px] leading-normal p
            placeholder-[#999]"
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
            />
            <button
              className="border border-[#D7DCE0] rounded h-[36px] px-2 py-2"
              onClick={() => searchFiles()}
            >
              <Image
                src={SearchOutlineIcon}
                height={20}
                alt="SearchOutlineIcon"
              />
            </button>
          </div>
          <div className="flex flex-row items-center gap-2">
            <input
              type="file"
              hidden={true}
              value={''}
              onChange={(e) => setNewFile(e.target.files?.[0])}
              id="file-upload"
            />
            <button
              className="border border-[#1F3832] rounded-lg h-[36px] px-[10px] py-[10px]"
              onClick={() => fetchFiles()}
            >
              <Image src={ReloadIcon} height={16} alt="ReloadIcon" />
            </button>
            <button
              className="flex flex-row items-center gap-2 border bg-[#1F3832] border-[#1F3832] rounded-lg h-[36px] px-3 py-2"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Image src={UploadIcon} height={18} alt="UploadIcon" />
              <span className="font-medium text-white text-[16px]">Upload</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bucket;
