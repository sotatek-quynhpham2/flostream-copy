import ChunkedUploady, { BatchItem } from '@rpldy/chunked-uploady'
import React, { useState } from 'react'
import UploadForm from './UploadForm'
import UploadInfo from './UploadInfo'
import { FileItem, UploadIdItem } from '@/types'

export default function UploadMain() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [uploadId, setUploadId] = useState<UploadIdItem[]>([])

  return (
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

        <UploadInfo setFileList={setFileList} isLoading={isLoading} fileList={fileList} />
      </div>
    </ChunkedUploady>
  )
}
