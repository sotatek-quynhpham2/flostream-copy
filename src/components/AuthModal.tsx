import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import WarningIcoon from '@/assets/icons/warning.svg';
import { toast } from 'react-toastify';

export const AuthModal = ({
  accessKeyId,
  secretAccessKey,
  setAccessKeyId,
  setSecretAccessKey,
  setShowModalAuth,
  getBuckets,
}: any) => {
  const [accessKeyIdError, setAccessKeyIdError] = useState<string>('');
  const [secretAccessKeyError, setSecretAccessKeyError] = useState<string>('');

  const checkAth = async () => {
    await fetch('/api/list-buckets', {
      method: 'POST',
      body: JSON.stringify({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then(async (data) => {
          sessionStorage.setItem('accessKeyId', accessKeyId);
          sessionStorage.setItem('secretAccessKey', secretAccessKey);
          setShowModalAuth(false);
          toast.success('Authentication successfully');
          await getBuckets();
        });
      } else {
        res.json().then((data) => {
          if (data.Code === 'InvalidAccessKeyId') {
            setAccessKeyIdError(data.message);
            setSecretAccessKeyError('');
          }
          if (data.Code === 'SignatureDoesNotMatch') {
            setSecretAccessKeyError(data.message);
            setAccessKeyIdError('');
          }
        });
      }
    });
  };

  useEffect(() => {
    setAccessKeyIdError('');
    setSecretAccessKeyError('');
  }, [accessKeyId, secretAccessKey]);

  return (
    <div
      id="auth-modal"
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 overflow-x-hidden w-full h-full p-5 overflow-y-auto bg-black bg-opacity-40 flex justify-center items-center"
    >
      <div className="relative md:w-[445px] p-6 rounded-[20px] bg-white">
        <div className="text-[#292929] text-[28px] text-center font-medium leading-normal">
          Authentication
        </div>
        <div className="text-[#292929] text-[16px] text-center font-normal leading-normal">
          Provide authentication to access the project.
        </div>
        <div className="mt-6">
          <div className="flex flex-col items-start justify-start gap-2 md:items-center md:flex-row md:justify-between">
            <label className="text-[#4C4C4C] text-[16px] text-center font-normal leading-normal">
              Access Key
            </label>
            <input
              type="text"
              value={accessKeyId}
              className={`w-full md:w-[240px] h-8 border border-[#BFBFBF] rounded text-[#1F3832] px-2 py-1 overflow-ellipsis focus-visible:outline-none ${
                accessKeyIdError
                  ? 'border-[#D72B28] text-[#D72B28]'
                  : 'border-[#BFBFBF] text-[#1F3832]'
              }`}
              onChange={(e) => setAccessKeyId(e.target.value)}
            ></input>
          </div>
          {accessKeyIdError && (
            <div className="mt-2 flex items-center gap-2 justify-end">
              <Image src={WarningIcoon} height={16} alt="WarningIcoon" />
              <span className="text-[#D72B28] text-[13px] font-normal leading-normal">
                {accessKeyIdError}
              </span>
            </div>
          )}
          <div className="mt-3 flex flex-col items-start justify-start gap-2 md:items-center md:flex-row md:justify-between">
            <label className="text-[#4C4C4C] text-[16px] text-center font-normal leading-normal">
              Secret Key
            </label>
            <input
              type="text"
              value={secretAccessKey}
              className={`w-full md:w-[240px] h-8 border border-[#BFBFBF] rounded text-[#1F3832] px-2 py-1 overflow-ellipsis focus-visible:outline-none ${
                secretAccessKeyError
                  ? 'border-[#D72B28] text-[#D72B28]'
                  : 'border-[#BFBFBF] text-[#1F3832]'
              }`}
              onChange={(e) => setSecretAccessKey(e.target.value)}
            ></input>
          </div>
          {secretAccessKeyError && (
            <div className="mt-2 flex items-center gap-2 justify-end">
              <Image src={WarningIcoon} height={16} alt="WarningIcoon" />
              <span className="text-[#D72B28] text-[13px] font-normal leading-normal">
                {secretAccessKeyError}
              </span>
            </div>
          )}
          <div className="mt-6 text-right">
            <button
              onClick={() => checkAth()}
              className="px-3 h-9 rounded-[8px] font-normal text-white bg-[#1F3832] disabled:bg-[#999999] disabled:cursor-not-allowed"
              disabled={
                !accessKeyId || !secretAccessKey || accessKeyIdError
                  ? true
                  : false || secretAccessKeyError
                  ? true
                  : false
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
