import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

export const DefaultLayout = ({ children }: any) => {
  const router = useRouter();
  const [host, setHost] = useState<string>('');

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  return (
    <>
      <Head>
        <title>Flostream</title>
        <meta name="theme-color" content="#FF6B78" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="description" content="Flostream" />
      </Head>
      <div className="default-layout bg-[#EFEFF2] min-h-dvh p-5 md:p-9">
        {router.pathname.includes('shared') && (
          <div className="mb-[60px] border border-neutral-5 w-full max-w-[1266px] mx-auto flex items-center justify-start bg-white text-neutral-1 text-[14px] font-normal leading-normal">
            <div className="px-3 py-2 border-r border-neutral-5">
              {host.includes('localhost') ? 'http://' : 'https://'}
            </div>
            <div className="px-3 py-2 truncate">{host + router.asPath}</div>
          </div>
        )}
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
};
