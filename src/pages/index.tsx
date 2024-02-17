import UploadForm from '@/components/UploadForm'
import UploadInfo from '@/components/UploadInfo'
import { DefaultLayout as Layout } from '@/layouts/default'
import ChunkedUploady, { BatchItem } from '@rpldy/chunked-uploady'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useRequestPreSend } from '@rpldy/uploady'

const HomePage: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalFiles, setTotalFiles] = useState<number>(0)

  const [filesResponse, setFilesResponse] = useState<any>([])
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
          fastAbortThreshold={5}
          destination={{ url: '/api/upload-file' }}
        >
          <div className='mt-6 md:mt-9 w-full mx-auto xl:w-[1080px] md:min-h-[685px] grid grid-cols-1 md:grid-cols-2'>
            <UploadForm
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              fileList={fileList}
              setFileList={setFileList}
            />

            <UploadInfo
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              totalFiles={totalFiles}
              filesResponse={filesResponse}
              fileList={fileList}
            />
          </div>
        </ChunkedUploady>
      )}
    </Layout>
  )
}

export default HomePage
