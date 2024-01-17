import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import FilePlusIcon from '@/assets/icons/file-plus.svg';
import ReloadIcon from '@/assets/icons/reload.svg';
import DotIcon from '@/assets/icons/dot.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import SendIcon from '@/assets/icons/send.svg';

import { toast } from 'react-toastify';

const MainLeft = ({ setIsLoading, setPresignedUrl }: any) => {
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [files, setFiles] = useState<any>([]);

  const limitSize = 1000000000;

  const bytesToSize = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const filesSize = () => {
    return files.reduce((acc: number, file: any) => acc + file.size, 0);
  };

  const handleUpload = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  useEffect(() => {
    setPresignedUrl('');
  }, [files]);

  const handleReset = () => {
    setFiles([]);
    setPresignedUrl('');
  };

  const handleRemoveFile = (name: string) => {
    const newFiles = files.filter((file: any) => file.name !== name);
    setFiles(newFiles);
  };

  const handleSend = () => {
    if(filesSize() > limitSize) {
      toast.warning('Total files must not exceed 1GB.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Presigned URL generated.');
      setIsLoading(false);
      setPresignedUrl('https://flostream.com');
    }, 3000);
  };

  return (
    <div className="h-full bg-white rounded-xl md:rounded-r-[0px] p-6 md:px-[60px] md:py-[50px]">
      <div className="text-neutral-1 text-[18px] font-bold leading-normal uppercase">
        Send
      </div>
      <input
        type="file"
        multiple
        className="hidden"
        id="input-file"
        onChange={(e) => {
          handleUpload(e);
        }}
      />
      <div
        className="mt-3 border border-dashed border-primary rounded-xl bg-[rgba(255, 233, 225, 0.25)] p-[30px] flex flex-col justify-center items-center cursor-pointer"
        onClick={() => document.getElementById('input-file')?.click()}
      >
        <Image src={FilePlusIcon} width={48} height={48} alt="FilePlusIcon" />
        <span className="text-primary text-[16px] font-medium">Add file</span>
      </div>

      {files.length !== 0 && (
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[16px] font-normal leading-normal">
              <span className="text-neutral-2">
                Total <strong>{files.length}</strong> files
              </span>
              <span className="text-neutral-3 border-l border-neutral-4 pl-2">
                {bytesToSize(filesSize())}
              </span>
            </div>
            <button
              className="flex items-center gap-2 text-info text-[16px] font-normal leading-normal"
              onClick={() => handleReset()}
            >
              <Image src={ReloadIcon} height={14} alt="ReloadIcon" />
              Reset
            </button>
          </div>

          <div
            role="list"
            className="bg-neutral-5 rounded-xl px-5 py-4 flex flex-col gap-[10px] max-h-[200px] overflow-y-auto"
          >
            {files.map((file: any) => (
              <div
                className="border-t border-neutral-4 pt-[10px] first:border-none first:pt-0"
                key={file.name}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <Image src={DotIcon} height={24} alt="DotIcon" />
                    <div className="flex flex-col items-start">
                      <span className="text-neutral-1 text-[16px] font-medium leading-normal flex ">
                        {file.name}
                      </span>
                      <span className="text-neutral-2 text-[12px] font-normal leading-normal">
                        {bytesToSize(file.size)}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveFile(file.name)}>
                    <Image src={TrashIcon} height={24} alt="TrashIcon" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="w-full h-10 rounded-[10px] bg-primary text-white text-[16px] font-medium flex items-center justify-center gap-1"
            onClick={() => handleSend()}
          >
            <Image src={SendIcon} height={24} alt="SendIcon" priority />
            Send
          </button>
        </div>
      )}

      <div className="mt-10 text-neutral-1 text-[18px] font-bold leading-normal uppercase">
        Receive
      </div>
      <div className="mt-2 text-neutral-2 text-[14px] font-normal leading-normal">
        Just paste the file link in the url of the browser to receive the file.
      </div>
    </div>
  );
};

export default MainLeft;
