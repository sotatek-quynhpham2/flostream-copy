import Head from 'next/head';
import React from 'react';
import Header from '@/components/Header';

export const DefaultLayout = ({ children }: any) => {
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
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
};
