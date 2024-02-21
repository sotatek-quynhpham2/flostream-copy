'use client'

import UploadForm from '@/components/UploadForm'
import UploadInfo from '@/components/UploadInfo'
import { DefaultLayout as Layout } from '@/layouts/default'
import ChunkedUploady, { BatchItem } from '@rpldy/chunked-uploady'
import { UploadIdItem } from '@/types'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

const HomePage: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isClient, setIsClient] = useState(false)
  const [fileList, setFileList] = useState<BatchItem[]>([])
  const [uploadId, setUploadId] = useState<UploadIdItem[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])


  return (
    <Layout>
      {isClient && (
        <ChunkedUploady
          concurrent
          chunked={true}
          parallel={10}
          chunkSize={10 * 1024 * 1024}
          maxConcurrent={10}
          autoUpload={true}
          multiple={true}
          sendWithFormData={true}
          headers={{
            timeout: Infinity
          }}
          destination={{ url: '/api/upload-part' }}
        >
          <div className='mt-6 md:mt-9 w-full mx-auto xl:w-[1080px] md:min-h-[685px] grid grid-cols-1 md:grid-cols-2'>
            <UploadForm
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              fileList={fileList}
              setFileList={setFileList}
              uploadId={uploadId}
              setUploadId={setUploadId}
            />

            <UploadInfo isLoading={isLoading} fileList={fileList} />
          </div>
        </ChunkedUploady>
      )}
    </Layout>
  )
}

export default HomePage
