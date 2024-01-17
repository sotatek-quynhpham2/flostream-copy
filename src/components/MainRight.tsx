import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import LoadingIcon from '@/assets/icons/loading.svg';
import CopyIcon from '@/assets/icons/copy.svg';

import { toast } from 'react-toastify';

const MainRight = ({ isLoading, presignedUrl }: any) => {
  const previewUrl = (url: string) => {
    
  };

  return (
    <div className={`h-full bg-white rounded-xl md:rounded-l-[0px] p-6 md:px-[60px] md:py-[50px]
      ${!isLoading && !presignedUrl && 'max-md:hidden'}
    `}>
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <Image
            src={LoadingIcon}
            alt="Loading"
            height={120}
            className="animate-spin max-md:w-[50px]"
          />
        </div>
      )}
      {!isLoading && presignedUrl && (
        <>
          <div className="border border-neutral-4 rounded-[10px] flex items-center justify-between">
            <div className="px-[16px] py-3 text-neutral-1 text-[16px] font-normal leading-normal cursor-pointer"
              onClick={() => previewUrl(presignedUrl)}
            >
              {presignedUrl}
            </div>
            <div className="px-[16px] py-3 flex items-center border-l border-neutral-4">
              <Image
                src={CopyIcon}
                height={24}
                alt="CopyIcon"
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(presignedUrl);
                  toast.success('Copied to clipboard!');
                }}
              />
            </div>
          </div>
          <div className="mt-2 text-neutral-2 text-[14px] font-normal leading-normal">
            <strong>Copy link to share. </strong>Your file will be available for
            48 hours.
          </div>
        </>
      )}
    </div>
  );
};

export default MainRight;
