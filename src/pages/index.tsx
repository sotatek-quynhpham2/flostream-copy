import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { DefaultLayout as Layout } from "@/layouts/default";
import { Main } from "@/components/Main";


const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Flostream Storage</title>
        <meta name="theme-color" content="#ffffff"/>
        <meta name="viewport" content="width=device-width"/>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
        <meta name="description" content="FloStream Storage" />
      </Head>
      <Main />
    </Layout>
  );
};

export default Home;