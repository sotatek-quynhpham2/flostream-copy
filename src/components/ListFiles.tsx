import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import moment from 'moment';

import FileIcon from '@/assets/icons/file.svg';
import CopyIcon from '@/assets/icons/copy.svg';
import DownloadIcon from '@/assets/icons/download.svg';

export const ListFile = ({ files }: any) => {
  const bytesToSize = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  const handleCopy = (file: any) => {
    console.log('handleCopy', file);
  };

  const handleDownload = (file: any) => {
    console.log('handleDownload', file);
  };

  return (
    <table className="w-full border border-[#BFBFBF]">
      <thead className="bg-[#1F3832] text-white text-[16px] font-medium leading-normal">
        <tr>
          <td className="px-4 py-2 text-left">Name</td>
          <td className="px-4 py-2 text-left">Type</td>
          <td className="px-4 py-2 text-right">Last modified</td>
          <td className="px-4 py-2 text-center">Size</td>
          <td className="px-4 py-2 text-center">Action</td>
        </tr>
      </thead>
      <tbody role="list">
        {files?.map((file: any) => (
          <tr
            key={file.Key}
            className="odd:bg-white even:bg-[#F2F2F2] text-[#292929] text-[16px] font-normal leading-normal"
          >
            <td className="px-4 py-2 text-left flex gap-[10px] justify-left items-center">
              <Image src={FileIcon} height={20} alt="FileIcon" />
              <span>{file?.Key}</span>
            </td>
            <td className="px-4 py-2 text-left">{file?.Type}</td>
            <td className="px-4 py-2 text-right">
              {moment(file?.LastModified).format('HH:mm DD/MM/YYYY')}
            </td>
            <td className="px-4 py-2 text-center">
              {bytesToSize(file?.Size)}
            </td>
            <td className="px-4 py-2 text-center flex gap-[10px] justify-center items-center">
              <button
                onClick={() => {
                  handleCopy(file);
                }}
              >
                <Image src={CopyIcon} height={18} alt="CopyIcon" />
              </button>
              <button
                onClick={() => {
                  handleDownload(file);
                }}
              >
                <Image src={DownloadIcon} height={20} alt="DownloadIcon" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
