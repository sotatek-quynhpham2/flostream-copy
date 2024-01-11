import React, { useState, useEffect } from 'react';
import { Table } from './Table';

import Image from 'next/image';
import SearchOutlineIcon from '@/assets/icons/search-outline.svg';
import ReloadIcon from '@/assets/icons/reload.svg';
import ClearIcon from '@/assets/icons/clear.svg';

export const Main = ({ dataBuckets, refreshBuckets }: any) => {
  const [bucketByFilter, setBucketByFilter] = useState<any>([]);

  const [keySearch, setKeySearch] = useState<string>('');

  const searchBucket = () => {
    if (!keySearch) {
      setBucketByFilter(dataBuckets);
      return;
    } else {
      let newBuckets = dataBuckets.filter((bucket: any) => {
        return bucket.Name.includes(keySearch.toLowerCase());
      });
      setBucketByFilter(newBuckets);
    }
  };

  const clearSearch = () => {
    setKeySearch('');
    setBucketByFilter(dataBuckets);
  };

  const refresh = () => {
    setKeySearch('');
    refreshBuckets();
  };

  const createBucket = () => {};

  useEffect(() => {
    setBucketByFilter(dataBuckets);
  }, [dataBuckets]);

  return (
    <div id="main" className="use-tailwind">
      <div className="grid grid-col-12 px-12 py-8">
        <h2 className="mt-6 text-[#292929] font-bold text-[28px] leading-normal">
          Buckets
        </h2>
        <div className="mt-6 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2 relative">
            <input
              type="text"
              placeholder="Search buckets"
              className="border border-[#D7DCE0] rounded w-[300px] h-[36px] px-10 py-2 focus-visible:outline-none font-normal text-[#292929] text-[16px] leading-normal p
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
                onClick={() => clearSearch ()}
              />
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            <button
              className="border border-[#1F3832] rounded-lg h-[36px] px-[10px] py-[10px]"
              onClick={() => refresh()}
            >
              <Image src={ReloadIcon} height={16} alt="ReloadIcon" />
            </button>
            <button
              className="flex flex-row items-center gap-2 border bg-[#1F3832] border-[#1F3832] rounded-lg h-[36px] px-3 py-2"
              onClick={() => createBucket()}
            >
              <span className="font-medium text-white text-[16px]">
                Create Bucket
              </span>
            </button>
          </div>
        </div>
        <div className="flex align-middle mt-6 justify-center min-h-[400px] border border-[#BFBFBF]">
          {dataBuckets && <Table dataTable={bucketByFilter}/>}
        </div>
      </div>
    </div>
  );
};
