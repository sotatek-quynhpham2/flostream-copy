import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { DefaultLayout as Layout } from '@/layouts/default';
import { AuthModal } from '@/components/AuthModal';
import { CreateBucketModal } from '@/components/CreateBucketModal';
import { TableBuckets } from '@/components/TableBuckets';

import Image from 'next/image';
import SearchOutlineIcon from '@/assets/icons/search-outline.svg';
import ReloadIcon from '@/assets/icons/reload.svg';
import ClearIcon from '@/assets/icons/clear.svg';

const BucketsPage: NextPage = ({ toast }: any) => {
  const [showModalAuth, setShowModalAuth] = useState(true);
  const [showModalCreateBucket, setShowModalCreateBucket] = useState(false);

  const [buckets, setBuckets] = useState<any>([]);
  const [bucketByFilter, setBucketByFilter] = useState<any>([]);
  const [keySearch, setKeySearch] = useState<string>('');

  const [accessKeyId, setAccessKeyId] = useState<string>(
    'AKIAQFPO2RESJQOEOV7L' // aws
    // 'SKEZ6znfei9avPnqorCQ3nqLws' // flostream
  );

  const [secretAccessKey, setSecretAccessKey] = useState<string>(
    'PTyW4KO6djtUVACvlK+vTo7qeFYsDCCXhW/rP8ub' // aws
    // 'bb9fd7ee7925a0420a1b54105998ab0d69fb3b567aecb8d98338b8c4ff1ef762' // flostream
  );

  const getBuckets = () => {
    fetch('/api/list-buckets', {
      method: 'POST',
      body: JSON.stringify({
        accessKeyId,
        secretAccessKey,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then(async (data) => {
          setBuckets(data.Buckets);
          setShowModalAuth(false);
        });
      } else {
        res.json().then((data) => {
          toast.error(data.message);
        });
      }
    });
  };

  useEffect(() => {
    let accessKeyId = sessionStorage.getItem('accessKeyId');
    let secretAccessKey = sessionStorage.getItem('secretAccessKey');
    if (secretAccessKey && accessKeyId) {
      setShowModalAuth(false);
      getBuckets();
    }
  }, []);

  const searchBucket = () => {
    if (!keySearch) {
      setBucketByFilter(buckets);
      return;
    } else {
      let newBuckets = buckets.filter((bucket: any) => {
        return bucket.Name.includes(keySearch.toLowerCase());
      });
      setBucketByFilter(newBuckets);
    }
  };

  const clearSearch = () => {
    setKeySearch('');
    setBucketByFilter(buckets);
  };

  const refresh = () => {
    setKeySearch('');
    getBuckets();
  };

  useEffect(() => {
    setBucketByFilter(buckets);
  }, [buckets]);

  return (
    <Layout>
      {showModalAuth && (
        <AuthModal
          accessKeyId={accessKeyId}
          secretAccessKey={secretAccessKey}
          setAccessKeyId={setAccessKeyId}
          setSecretAccessKey={setSecretAccessKey}
          setShowModalAuth={setShowModalAuth}
          getBuckets={getBuckets}
        />
      )}

      {showModalCreateBucket && (
        <CreateBucketModal
          buckets={buckets}
          setShowModalCreateBucket={setShowModalCreateBucket}
          getBuckets={getBuckets}
        />
      )}

      <div className="grid grid-col-12 p-5 md:px-12 md:py-8">
        <h2 className="text-[#292929] font-bold text-[28px] leading-normal">
          Buckets
        </h2>
        <div className="mt-6 flex flex-col gap-2 justify-between md:flex-row md:items-center">
          <div className="flex flex-row items-center gap-2 relative">
            <input
              type="text"
              placeholder="Search buckets"
              className="border border-[#D7DCE0] rounded w-full md:w-[300px] h-9 px-10 py-2 focus-visible:outline-none font-normal text-[#292929] text-[16px] leading-normal p
            placeholder-[#999]"
              value={keySearch}
              onKeyUp={() => searchBucket()}
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
            <button
              className="border border-[#1F3832] rounded-lg h-9 w-9 px-[10px] py-[10px]"
              onClick={() => refresh()}
            >
              <Image src={ReloadIcon} height={16} alt="ReloadIcon" />
            </button>
            <button
              className="flex flex-row justify-center items-center gap-2 border bg-[#1F3832] border-[#1F3832] rounded-lg h-9 w-[130px] px-3 py-2 font-medium text-white text-[16px]"
              onClick={() => setShowModalCreateBucket(true)}
            >
              <span className="font-medium text-white text-[16px]">
                Create Bucket
              </span>
            </button>
          </div>
        </div>
        <div className="mt-6 w-full overflow-auto">
          <TableBuckets buckets={bucketByFilter} />
        </div>
      </div>
    </Layout>
  );
};

export default BucketsPage;
