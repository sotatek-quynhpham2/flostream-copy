import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import LoadingIcon from '@/assets/icons/loading.svg';
import CopyIcon from '@/assets/icons/copy.svg';
import { bytesToSize } from '@/utils';
import { toast } from 'react-toastify';
import { Tooltip, TooltipRefProps } from 'react-tooltip'


const MainRight = ({
  isLoading,
  setIsLoading,
  totalFiles,
  filesResponse,
}: any) => {
  const [percent, setPercent] = useState<number>(0);
  const tooltipRef1 = useRef<TooltipRefProps>(null)

  const shareFile = async (file: any) => {
    await fetch('/api/create-presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        objectKey: file.name,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          const slug =
            data
              .split(
                process.env.NEXT_PUBLIC_STORE_ENDPOINT +
                `/${process.env.NEXT_PUBLIC_STORE_BUCKET}/`
              )
              .pop() + `&size=${file.size}`;

          const url = `${window.location.origin}/shared/${process.env.NEXT_PUBLIC_STORE_BUCKET}/${slug}`;
          navigator.clipboard.writeText(url);
          toast.success('Copied! The presigned url will expire in 24h');
          tooltipRef1.current?.open({
            anchorSelect: '#copied',
            content: 'Link copied to clipboard!',
            place: 'bottom'
          })
          filesResponse.filter((item: any) => {
            if (item.name === file.name) {
              item.linkPreUrl = url
            }
          })
          console.log(file);

        });
      } else {
        res.json().then((data) => {
          toast.error(data.message);
        });
      }
    });
  };

  useEffect(() => {
    if (totalFiles > 0) {
      const newPercent = ((filesResponse.length / totalFiles) * 100).toFixed(0);
      setPercent(Number(newPercent));
    }
    if (filesResponse.length === totalFiles) {
      setIsLoading(false);
    }
  }, [filesResponse.length]);
  return (
    <div
      className={`h-full bg-white rounded-xl md:rounded-l-[0px] p-6 md:px-[60px] md:py-[50px] max-md:mt-4
      ${!isLoading && !filesResponse && 'max-md:hidden'}
    `}
    >
      {filesResponse.length !== 0 && (
        <>
          <div className="text-neutral-1 text-[18px] font-bold leading-normal uppercase">
            Files
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="bg-[#1990ff] text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${percent}%` }}
            >
              {percent}%
            </div>
          </div>
          <div className="mt-2 text-neutral-2 text-[14px] font-normal leading-normal">
            <strong>Copy link to share. </strong>Your file will be available for
            24 hours.
          </div>
          <div className="mt-5 max-h-[500px] overflow-auto flex flex-col gap-3">

            {filesResponse.map((file: any) => (
              <div
                key={file.name}
                className="w-full text-[20px] font-medium leading-normal justify-between"
              >
                <div className="w-full text-[20px] font-medium leading-normal justify-between flex mb-4">
                  <p className="text-primary whitespace-nowrap text-ellipsis overflow-hidden">
                    {file.name}
                  </p>
                  <p className="text-neutral-2 whitespace-nowrap text-ellipsis">
                    {bytesToSize(file.size)}
                  </p>
                </div>

                <div className="w-full text-[20px] font-medium leading-normal justify-between flex border border-neutral-4 rounded-lg">
                  <div
                    className="px-[16px] py-2 text-neutral-1 text-[16px] font-normal leading-normal cursor-pointer truncate"
                    onClick={() => shareFile(file)}
                  >
                    {file.linkPreUrl ? file.linkPreUrl : 'Click to copy link'}
                  </div>
                  <p className="min-w-[48px] py-2 px-2 border-l-[1px] flex justify-center" id="copied">
                    <Image
                      src={CopyIcon}
                      height={24}
                      alt="CopyIcon"
                      className="cursor-pointer"
                      onClick={() => shareFile(file)}
                    />
                  </p>
                  <Tooltip ref={tooltipRef1} />

                </div>
              </div>
            ))}

          </div>
        </>
      )}
      {isLoading && (
        <div className="flex justify-center items-center h-full flex-col gap-2 text-center">
          <Image
            src={LoadingIcon}
            alt="Loading"
            height={120}
            className="animate-spin max-md:w-[50px]"
          />
          <div className="text-[20px] font-medium leading-normal">
            Uploading...
          </div>
          <div className="text-neutral-2 text-[14px] font-normal leading-normal">
            Your file(s) are being uploaded.
          </div>
        </div>
      )}
    </div>
  );
};

export default MainRight;
