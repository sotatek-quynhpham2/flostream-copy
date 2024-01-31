import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import FilePlusIcon from '@/assets/icons/file-plus.svg';
import ReloadIcon from '@/assets/icons/reload.svg';
import DotIcon from '@/assets/icons/dot.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import SendIcon from '@/assets/icons/send.svg';
import { bytesToSize } from '@/utils';
import { toast } from 'react-toastify';
import * as zip from '@zip.js/zip.js';
import BigNumber from 'bignumber.js';

const MainLeft = ({
  isLoading,
  setIsLoading,
  setFilePreview,
  setPresignedUrl,
}: any) => {
  const [files, setFiles] = useState<any>([]);
  const limitSize = new BigNumber(20).mul(1024).mul(1024).mul(1024).toString();

  const filesSize = () => {
    return files.reduce((acc: number, file: any) => acc + file.size, 0);
  };

  const fileToBlob = async (file: File) => {
    const blob = await new Response(file).blob();
    return blob;
  };

  const compressFiles = async (files: [any]) => {
    const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'));
    for (const file of files) {
      const blob = await fileToBlob(file);
      await zipWriter.add(file.name, new zip.BlobReader(blob));
    }
    return zipWriter.close();
  };

  const handleChangeFile = (e: any) => {
    const newFiles = Array.from(e.target.files);
    const temp = [...files];
    console.log(files);
    newFiles.forEach((file: any) => {
      if (temp.findIndex((f: any) => f.name === file.name) === -1) {
        temp.unshift(file);
        console.log('1');
      } else {
        console.log('2');
        temp.splice(
          temp.findIndex((f: any) => f.name === file.name),
          1
        );
        temp.unshift(file);
      }
    });
    setFiles(temp);
  };

  useEffect(() => {
    setPresignedUrl('');
  }, [files]);

  const handleReset = () => {
    setFiles([]);
    setPresignedUrl('');
    const inputFile = document.getElementById('input-file') as HTMLInputElement;
    if (inputFile) {
      inputFile.value = '';
    }
  };

  const handleRemoveFile = (name: string) => {
    const newFiles = files.filter((file: any) => file.name !== name);
    setFiles(newFiles);
    const inputFile = document.getElementById('input-file') as HTMLInputElement;
    if (inputFile) {
      inputFile.value = '';
    }
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);

    await fetch('/api/upload-file', {
      method: 'POST',
      body: formData,
    }).then(async (res) => {
      if (res.ok) {
        res.json().then((data) => {
          setIsLoading(false);
          setPresignedUrl(data);
          toast.success('Presigned URL generated!');
        });
        files.length = 0
      } else {
        res.json().then((data) => {
          setIsLoading(false);
          toast.error(data.message);
        });
      }
    });
  };

  const handleSend = async () => {
    setIsLoading(true);

    // 1 file
    if (files.length === 1) {
      const name =
        files[0].name.split('.')[0] +
        '-' +
        Date.now() +
        '.' +
        files[0].name.split('.').pop();
      const customFile = new File([files[0]], name, { type: files[0].type });
      setFilePreview(customFile);
      uploadFile(customFile);
      return;
    }

    // multiple files
    await compressFiles(files).then((blob: any) => {
      const name = 'files-' + Date.now() + '.zip';
      const zipFile = new File([blob], name, { type: 'application/zip' });
      setFilePreview(zipFile);

      if (
        new BigNumber(zipFile.size).gt(limitSize) ||
        new BigNumber(filesSize()).gt(limitSize)
      ) {
        toast.warning('Total files must not exceed 1GB.');
        setIsLoading(false);
        return;
      }
      uploadFile(zipFile);
    });
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
          handleChangeFile(e);
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
                Total <strong>{files.length}</strong> {
                  files.length === 1 ? 'file' : 'files'
                }
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
            className="w-full h-10 rounded-[10px] bg-primary text-white text-[16px] font-medium flex items-center justify-center gap-1 disabled:bg-opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleSend()}
            disabled={isLoading}
          >
            <Image src={SendIcon} height={24} alt="SendIcon" />
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
