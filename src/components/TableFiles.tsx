import React from 'react';
import Image from 'next/image';
import moment from 'moment';
import { toast } from 'react-toastify';

import FileIcon from '@/assets/icons/file.svg';
import CopyIcon from '@/assets/icons/copy.svg';
import DownloadIcon from '@/assets/icons/download.svg';

export const TableFiles = ({ bucket, files }: any) => {
  const getFileType = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase();
  };

  const bytesToSize = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleCopy = async (key: string) => {
    await fetch('/api/create-presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        accessKeyId: sessionStorage.getItem('accessKeyId'),
        secretAccessKey: sessionStorage.getItem('secretAccessKey'),
        bucketName: bucket,
        objectKey: key,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          navigator.clipboard.writeText(data);
          toast.success('Copied! The presigned url will expire in 24h');
        });
      } else {
        res.json().then((data) => {
          toast.error(data.message);
        });
      }
    });
  };

  const handleDownload = async (key: string) => {
    await fetch('/api/create-presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        accessKeyId: sessionStorage.getItem('accessKeyId'),
        secretAccessKey: sessionStorage.getItem('secretAccessKey'),
        bucketName: bucket,
        objectKey: key,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then(async (data) => {
          const blob = await fetch(data?.url).then((r) => r.blob());
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = key;
          link.click();
        });
      } else {
        res.json().then((data) => {
          toast.error(data.message);
        });
      }
    });
  };

  return (
    <table className="w-full border border-[#BFBFBF]">
      <thead className="bg-[#1F3832] text-white text-[16px] font-medium leading-normal">
        <tr>
          <td className="px-4 py-2 text-left min-w-[300px]">Name</td>
          <td className="px-4 py-2 text-left min-w-24">Type</td>
          <td className="px-4 py-2 text-right min-w-[200px]">Last modified</td>
          <td className="px-4 py-2 text-center min-w-[150px]">Size</td>
          <td className="px-4 py-2 text-center min-w-24">Action</td>
        </tr>
      </thead>
      <tbody role="list">
        {files?.length > 0 ? (
          files?.map((file: any) => (
            <tr
              key={file.Key}
              className="odd:bg-white even:bg-[#F2F2F2] text-[#292929] text-[16px] font-normal leading-normal"
            >
              <td className="px-4 py-2 text-left flex gap-[10px] justify-left items-center">
                <Image src={FileIcon} height={20} alt="FileIcon" />
                <span>{file?.Key}</span>
              </td>
              <td className="px-4 py-2 text-left">{getFileType(file?.Key)}</td>
              <td className="px-4 py-2 text-right">
                {moment(file?.LastModified).format('HH:mm DD/MM/YYYY')}
              </td>
              <td className="px-4 py-2 text-center">
                {bytesToSize(file?.Size)}
              </td>
              <td className="px-4 py-2 text-center flex gap-[10px] justify-center items-center">
                <button
                  onClick={() => {
                    handleCopy(file.Key);
                  }}
                  title="Copy presigned url"
                >
                  <Image src={CopyIcon} height={18} alt="CopyIcon" />
                </button>
                <button
                  onClick={() => {
                    handleDownload(file.Key);
                  }}
                  title="Download"
                >
                  <Image src={DownloadIcon} height={20} alt="DownloadIcon" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr className="bg-white text-[#292929] text-[16px] font-normal leading-normal min-h-24">
            <td className="px-4 py-2 text-center h-[400px]" colSpan={5}>
              No file found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
