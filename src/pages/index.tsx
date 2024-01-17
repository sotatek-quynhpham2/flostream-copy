import type { NextPage } from 'next';
import React, { useState } from 'react';
import { DefaultLayout as Layout } from '@/layouts/default';
import MainLeft from '@/components/MainLeft';
import MainRight from '@/components/MainRight';

const HomePage: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [presignedUrl, setPresignedUrl] = useState<string>('');

  const createPresignedUrl = async (file: File) => {
    setIsLoading(true);
  };

  return (
    <Layout>
      <div className="m-auto mt-6 md:mt-9 max-w-[1080px] md:min-h-[685px] grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-1">
        <MainLeft
          setIsLoading={setIsLoading}
          setPresignedUrl={setPresignedUrl}
        />
        <MainRight isLoading={isLoading} presignedUrl={presignedUrl} />
      </div>
    </Layout>
  );
};

export default HomePage;
