import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CloseIcon from '@/assets/icons/close.svg';
import WarningIcoon from '@/assets/icons/warning.svg';
import { toast } from 'react-toastify';

export const CreateBucketModal = ({
  buckets,
  setShowModalCreateBucket,
  getBuckets,
}: any) => {
  const [bucketName, setBucketName] = useState<string>('');
  const [bucketError, setBucketError] = useState<string>('');

  const bucketNameRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  const createBucket = async () => {
    await fetch('/api/create-bucket', {
      method: 'POST',
      body: JSON.stringify({
        accessKeyId: sessionStorage.getItem('accessKeyId'),
        secretAccessKey: sessionStorage.getItem('secretAccessKey'),
        bucketName: bucketName,
      }),
    }).then((res) => {
      if (res.ok) {
        setShowModalCreateBucket(false);
        toast.success('Create bucket successfully');
        getBuckets();
      } else {
        res.json().then((data) => {
          setBucketError(data.message);
        });
      }
    });
  };

  useEffect(() => {
    if (
      (bucketName && !bucketNameRegex.test(bucketName)) ||
      bucketName?.length > 63
    ) {
      setBucketError('Bucket name is invalid.');
      return;
    }

    if (buckets?.length > 0) {
      let isExist = buckets?.find((bucket: any) => bucket.Name === bucketName);
      if (isExist) {
        setBucketError('Existed bucket name.');
      } else {
        setBucketError('');
      }
    }
  }, [bucketName]);

  return (
    <div
      id="create-bucket-modal"
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 overflow-x-hidden w-full h-full p-5 overflow-y-auto bg-black bg-opacity-40 flex justify-center items-center"
    >
      <div className="relative md:w-[445px] p-6 rounded-[20px] bg-white">
        <Image
          src={CloseIcon}
          height={16}
          alt="CloseIcon"
          className="absolute right-[22px] top-[16px] cursor-pointer"
          onClick={() => setShowModalCreateBucket(false)}
        />
        <div className="text-[#292929] text-[28px] text-center font-medium leading-normal">
          Create a bucket
        </div>
        <div className="text-[#292929] text-[16px] text-center font-normal leading-normal">
          Create a bucket to organize your files.
        </div>
        <div className="mt-6">
          <div className="flex flex-col items-start justify-start gap-2 md:items-center md:flex-row md:justify-between">
            <label className="text-[#4C4C4C] text-[16px] text-center font-normal leading-normal">
              Bucket Name
            </label>
            <input
              type="text"
              value={bucketName}
              className={`w-full md:w-[240px] h-8 border rounded px-4 py-1 overflow-ellipsis focus-visible:outline-none ${
                bucketError
                  ? 'border-[#D72B28] text-[#D72B28]'
                  : 'border-[#BFBFBF] text-[#1F3832]'
              }`}
              onChange={(e) => setBucketName(e.target.value)}
            ></input>
          </div>
        </div>
        {bucketError && (
          <div className="mt-2 flex items-center gap-2 justify-end">
            <Image src={WarningIcoon} height={16} alt="WarningIcoon" />
            <span className="text-[#D72B28] text-[13px] font-normal leading-normal">
              {bucketError}
            </span>
          </div>
        )}
        <div className="mt-6 text-right">
          <button
            onClick={() => createBucket()}
            className="px-3 h-9 rounded-[8px] font-normal text-white bg-[#1F3832] disabled:bg-[#999999] disabled:cursor-not-allowed"
            disabled={!bucketName || bucketError ? true : false}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
