import type { NextPage } from 'next';
import React, { useState } from 'react';
import { DefaultLayout as Layout } from '@/layouts/default';
import MainLeft from '@/components/MainLeft';
import MainRight from '@/components/MainRight';

const HomePage: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState<any>(undefined);
  const [presignedUrl, setPresignedUrl] = useState<string>('');

  return (
    <Layout>
      <div className="mt-6 md:mt-9 w-full mx-auto xl:w-[1080px] md:min-h-[685px] grid grid-cols-1 md:grid-cols-2">
        <MainLeft
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setFilePreview={setFilePreview}
          setPresignedUrl={setPresignedUrl}
        />
        <MainRight
          isLoading={isLoading}
          filePreview={filePreview}
          presignedUrl={presignedUrl}
        />
      </div>
    </Layout>
  );
};

export default HomePage;
