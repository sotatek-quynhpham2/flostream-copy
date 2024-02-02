import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import LoadingIcon from '@/assets/icons/loading.svg';
import CopyIcon from '@/assets/icons/copy.svg';
import { bytesToSize } from '@/utils';

import { toast } from 'react-toastify';

const MainRight = ({ isLoading, filePreview, presignedUrl }: any) => {
  const router = useRouter();
  const slug =
    presignedUrl.split('s3.amazonaws.com/').pop() +
    `&size=${filePreview?.size}`;
  const [sharedUrl, setSharedUrl] = useState<string>('');

  useEffect(() => {
    setSharedUrl(`${window.location.origin}/shared/${slug}`);
  }, [presignedUrl]);

  return (
    <div
      className={`h-full bg-white rounded-xl md:rounded-l-[0px] p-6 md:px-[60px] md:py-[50px] max-md:mt-4
      ${!isLoading && !presignedUrl && 'max-md:hidden'}
    `}
    >
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
            Your file is being uploaded. Please wait.
          </div>
        </div>
      )}
      {!isLoading && filePreview && presignedUrl && (
        <>
          <div className="flex gap-[10px] text-[20px] font-medium leading-normal">
            <span className="text-primary">
              {filePreview.name.length > 36
                ? `${filePreview.name.slice(0, 36)}...`
                : filePreview.name}
            </span>
            <span className="text-neutral-2 whitespace-nowrap">
              {bytesToSize(filePreview.size)}
            </span>
          </div>
          <div className="mt-3 border border-neutral-4 rounded-[10px] flex items-center justify-between">
            <div
              className="px-[16px] py-3 text-neutral-1 text-[16px] font-normal leading-normal cursor-pointer truncate"
              onClick={() => router.push(sharedUrl)}
            >
              {sharedUrl}
            </div>
            <div className="py-3 border-l flex justify-center gap-3 border-neutral-4 w-full max-w-[50px] min-w-[50px]">
              <Image
                src={CopyIcon}
                height={24}
                alt="CopyIcon"
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(sharedUrl);
                  toast.success('Copied to clipboard!');
                }}
              />
            </div>
          </div>
          <div className="mt-2 text-neutral-2 text-[14px] font-normal leading-normal">
            <strong>Copy link to share. </strong>Your file will be available for
            24 hours.
          </div>
        </>
      )}
    </div>
  );
};

export default MainRight;
