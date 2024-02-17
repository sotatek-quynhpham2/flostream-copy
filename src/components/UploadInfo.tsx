'use client'

import LoadingIcon from '@/assets/icons/loading.svg'
import { BatchItem } from '@rpldy/uploady'
import Image from 'next/image'
import UploadedFileItem from './UploadedFileItem'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Progress } from '@aws-sdk/lib-storage'

interface Props {
  fileList: BatchItem[]
  isLoading: boolean
}

const UploadInfo = ({ isLoading, fileList }: Props) => {
  const [progressList, setProgressList] = useState<any>([])

  useEffect(() => {
    setInterval(() => {
      axios.get('/api/progress-upload-file').then((res) => {
        setProgressList(res.data.data)
      })
    }, 1000)
  }, [])

  return (
    <div
      className={`h-full bg-white rounded-xl md:rounded-l-[0px] p-6 md:px-[15px] md:py-[50px] max-md:mt-4
    `}
    >
      {isLoading && (
        <div className='flex justify-center items-center h-full flex-col gap-2 text-center'>
          <Image src={LoadingIcon} alt='Loading' height={120} className='animate-spin max-md:w-[50px]' />
          <div className='text-[20px] font-medium leading-normal'>Compress...</div>
          <div className='text-neutral-2 text-[14px] font-normal leading-normal'>
            Your file(s) are being compressed.
          </div>
        </div>
      )}

      <div className=' rounded-xl px-5 py-4 flex flex-col gap-[10px] max-h-[700px] overflow-y-auto list-file'>
        {fileList.map((fileItem) => (
          <UploadedFileItem progressList={progressList} key={fileItem.id} fileItem={fileItem} />
        ))}
      </div>
    </div>
  )
}

export default UploadInfo
