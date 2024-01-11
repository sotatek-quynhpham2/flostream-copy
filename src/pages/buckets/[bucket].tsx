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
import ClearIcon from '@/assets/icons/clear.svg';

import { ListFile } from '@/components/ListFiles';

const Bucket: NextPage = () => {
  const router = useRouter();
  const { bucket } = router.query;
  const [accessKeyId, setAccessKeyId] = useState<string>();
  const [secretAccessKey, setSecretAccessKey] = useState<string>('');

  const [keySearch, setKeySearch] = useState<string>('');
  const [files, setFiles] = useState<any>([]);
  const [filesByFilter, setFilesByFilter] = useState<any>([]);

  const [newFile, setNewFile] = useState<any>(undefined);

  const searchFiles = () => {
    if (!keySearch) {
      setFilesByFilter(files);
      return;
    } else {
      let newFiles = files.filter((file: any) => {
        return file.Key.includes(keySearch.toLowerCase());
      });
      setFilesByFilter(newFiles);
    }
  };

  const clearSearch = () => {
    setKeySearch('');
    setFilesByFilter(files);
  }

  const refresh = () => {
    fetchFiles();
    setKeySearch('');
  };

  const fetchFiles = async () => {
    let accessKeyId = sessionStorage.getItem('accessKeyId');
    let secretAccessKey = sessionStorage.getItem('secretAccessKey');
    if (accessKeyId && secretAccessKey) {
      setAccessKeyId(accessKeyId);
      setSecretAccessKey(secretAccessKey);

      await fetch('/api/list-files', {
        method: 'POST',
        body: JSON.stringify({
          accessKeyId,
          secretAccessKey,
          bucketName: bucket,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setFiles(data?.Contents);
          setFilesByFilter(data?.Contents);
        });
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    if (bucket) {
      fetchFiles();
    }
  }, [bucket]);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', newFile);
    formData.append('accessKeyId', accessKeyId as string);
    formData.append('secretAccessKey', secretAccessKey as string);
    formData.append('bucketName', bucket as string);

    await fetch('/api/upload-file', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setNewFile(undefined);
        fetchFiles();
      });
  };

  useEffect(() => {
    if (newFile) {
      uploadFile();
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
          {`Buckets / ${bucket}`}
        </h2>
        <div className="mt-6 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2 relative">
            <input
              type="text"
              placeholder="Search files"
              className="border border-[#D7DCE0] rounded w-[300px] h-[36px] px-10 py-2 focus-visible:outline-none font-normal text-[#292929] text-[16px] leading-normal p
            placeholder-[#999]"
              value={keySearch}
              onKeyUp={() => searchFiles()}
              onChange={(e) => setKeySearch(e.target.value)}
            />
            <Image
              src={SearchOutlineIcon}
              height={20}
              alt="SearchOutlineIcon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            {keySearch && (
              <Image
                src={ClearIcon}
                height={20}
                alt="SearchOutlineIcon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => clearSearch()}
              />
            )}
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
              onClick={() => refresh()}
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
        <div className="mt-6">
          <ListFile bucket={bucket} files={filesByFilter} />
        </div>
      </div>
    </Layout>
  );
};

export default Bucket;
