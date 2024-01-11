import type { NextPage } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { DefaultLayout as Layout } from "@/layouts/default";
import { Main } from "@/components/Main";
import { Modal } from "@/components/Modal";

const Home: NextPage = () => {
  const [showModal, setShowModal] = useState(true)
  const [buckets, setBuckets] = useState<any>([]);

  const [accessKeyId, setAccessKeyId] = useState<string>(
    'AKIAQFPO2RESJQOEOV7L'
  );

  const [secretAccessKey, setSecretAccessKey] = useState<string>(
    'PTyW4KO6djtUVACvlK+vTo7qeFYsDCCXhW/rP8ub'
  );

  const syncAuth = () => {
    sessionStorage.setItem('accessKeyId', accessKeyId);
    sessionStorage.setItem('secretAccessKey', secretAccessKey);
    getBuckets()
  }

  const getBuckets = () => {
    fetch('/api/list-buckets', {
      method: 'POST',
      body: JSON.stringify({
        accessKeyId,
        secretAccessKey,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBuckets(data.Buckets);
        setShowModal(false)
      });
  };

  useEffect(() => {
    let accessKeyId = sessionStorage.getItem('accessKeyId');
    let secretAccessKey = sessionStorage.getItem('secretAccessKey');
    if (secretAccessKey && accessKeyId) {
      setShowModal(false)
      getBuckets()
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>Flostream Storage</title>
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="description" content="FloStream Storage" />
      </Head>
      {
        showModal && (<Modal ariaLabel='Authentication' ariaLabelFooter='Next' handleNext={() => syncAuth()} showClose={false}>
          <p className="text-center text-baseText mb-6">Provide authentication to access the project.</p>
          <div className="text-center text-baseText">
            <div className="text-left pr-2 mb-2">
              <label className="text-secondText font-medium">Access Key: </label>
              <input
                type="text"
                value={accessKeyId}
                className="border border-colorBorder rounded-[4px] text-textInput px-2 float-right overflow-ellipsis"
                onChange={(e) => setAccessKeyId(e.target.value)}
              ></input>
            </div>
            <div className="mt-2 text-left pr-2">
              <label className="text-secondText font-medium">Secret Key: </label>
              <input
                type="text"
                value={secretAccessKey}
                className="border border-colorBorder rounded px-2 text-textInput float-right overflow-ellipsis"
                onChange={(e) => setSecretAccessKey(e.target.value)}
              ></input>
            </div>

          </div>
        </Modal>)
      }

      <Main dataBuckets={buckets} />
    </Layout>
  );
};

export default Home;