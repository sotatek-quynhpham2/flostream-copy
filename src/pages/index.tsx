'use client'

import UploadForm from '@/components/UploadForm'
import UploadInfo from '@/components/UploadInfo'
import { DefaultLayout as Layout } from '@/layouts/default'
import ChunkedUploady, { BatchItem } from '@rpldy/chunked-uploady'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

const HomePage: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isClient, setIsClient] = useState(false)
  const [fileList, setFileList] = useState<BatchItem[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Layout>
      {isClient && (
        <ChunkedUploady
          concurrent
          parallel={10}
          maxConcurrent={10}
          autoUpload={true}
          multiple={true}
          destination={{ url: '/api/upload-file' }}
        >
          <div className='mt-6 md:mt-9 w-full mx-auto xl:w-[1080px] md:min-h-[685px] grid grid-cols-1 md:grid-cols-2'>
            <UploadForm
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              fileList={fileList}
              setFileList={setFileList}
            />

            <UploadInfo isLoading={isLoading} fileList={fileList} />
          </div>
        </ChunkedUploady>
      )}
    </Layout>
  )
}

export default HomePage
