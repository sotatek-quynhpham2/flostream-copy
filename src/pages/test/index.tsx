import Head from 'next/head'
import React from 'react'
import { DefaultLayout as Layout } from '@/layouts/default'

const Test = () => {
  return (
    <Layout>
      <Head>
        <title>Test | FloStream Storage</title>
        <meta name='description' content='Test' />
      </Head>
      <div className='use-tailwind text-teal-500'>
        Test
      </div>
    </Layout>
  )
}

export default Test
