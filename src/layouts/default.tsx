import Head from 'next/head';
import React from 'react';
import { Header } from '@/components/Header';

export const DefaultLayout = ({ children }: any) => {
  return (
    <>
      <Head>
        <title>Flostream Storage</title>
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="description" content="Flostream Storage" />
      </Head>
      <div className="default-layout">
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
};
