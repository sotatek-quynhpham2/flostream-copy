import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { DefaultLayout as Layout } from '@/layouts/default';
import MainLeft from '@/components/MainLeft';
import MainRight from '@/components/MainRight';

const HomePage: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [filesResponse, setFilesResponse] = useState<any>([]);

  useEffect(() => {
    if (filesResponse.length === totalFiles && totalFiles > 0) {
      setIsLoading(false);
    }
  }, [filesResponse]);

  return (
    <Layout>
      <div className="mt-6 md:mt-9 w-full mx-auto xl:w-[1080px] md:min-h-[685px] grid grid-cols-1 md:grid-cols-2">
        <MainLeft
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTotalFiles={setTotalFiles}
          setFilesResponse={setFilesResponse}
        />
        <MainRight
          isLoading={isLoading}
          totalFiles={totalFiles}
          filesResponse={filesResponse}
        />
      </div>
    </Layout>
  );
};

export default HomePage;
