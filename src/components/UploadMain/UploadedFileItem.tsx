import copyIcon from '@/assets/icons/copy-alt.svg'
import FileItemIcon from '@/assets/icons/file-item.svg'
import { FileItem } from '@/types'
import { bytesToSize, formatTimeUpload } from '@/utils'
import { FILE_STATES, useItemFinishListener, useItemStartListener } from '@rpldy/chunked-uploady'
import axios from 'axios'
import copy from 'copy-to-clipboard'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback, useMemo, useRef } from 'react'
import { toast } from 'react-toastify'

interface Props {
  fileItem: FileItem
  setFileList: Dispatch<SetStateAction<FileItem[]>>
}

function UploadedFileItem({ fileItem, setFileList }: Props) {
  const timeStart = useRef(Date.now())

  useItemStartListener(() => {
    timeStart.current = Date.now()
  }, fileItem.id)

  const calcSpeedTime = useCallback(() => {
    const time = (Date.now() - timeStart.current) / 1000
    const dataLoaded = fileItem.loaded / (1024 * 1024)
    const fileSize = fileItem.file.size / (1024 * 1024)

    return {
      speed: dataLoaded / time,
      totalTime: formatTimeUpload((fileSize / dataLoaded) * time)
    }
  }, [fileItem])

  const statisticsUploading = useMemo(() => {
    return calcSpeedTime()
  }, [calcSpeedTime])

  useItemFinishListener((finishedItem) => {
    setFileList((prev) =>
      prev.map((item) => {
        if (item.id === fileItem.id) {
          return {
            ...finishedItem,
            ...calcSpeedTime()
          }
        }
        return item
      })
    )
  }, fileItem.id)

  const progressUploadToServer = useMemo(() => {
    return `${Math.round(fileItem.completed)}`
  }, [fileItem])

  const shareFile = async (file: any) => {
    try {
      const res = await axios.post('/api/create-presigned-url', { objectKey: file.name })

      const slug =
        res.data.split(process.env.NEXT_PUBLIC_STORE_ENDPOINT + `/${process.env.NEXT_PUBLIC_STORE_BUCKET}/`).pop() +
        `&size=${file.size}`
      const url = `${window.location.origin}/shared/${process.env.NEXT_PUBLIC_STORE_BUCKET}/${slug}`
      copy(url)
      toast.success('Copied! The presigned url will expire in 24h')
      file.linkPreUrl = url
    } catch (error) {}
  }

  return (
    <div className='flex border-primary border rounded-[20px] py-[17px] px-[20px] w-full gap-[10px]'>
      <div className='flex-shrink-0'>
        <Image src={FileItemIcon} alt='file' height={68} />
      </div>
      <div className='flex-1 flex flex-col gap-[7px]'>
        <div className='text-primary text-xs leading-[18px]'>{fileItem.file.name}</div>
        <div>
          <div className='bg-transparent rounded-full  border h-5px] border-primary w-4/5 '>
            <div
              style={{ width: `${progressUploadToServer}%` }}
              className='bg-primary h-[3px] rounded-r-none rounded-full duration-500'
            ></div>
          </div>
        </div>
        <div className='flex text-[10px]'>
          <div className='flex-1 mr-2'>
            <div>Size</div>
            <div>{bytesToSize(fileItem.file.size)}</div>
          </div>
          <div className='flex-1 mr-2'>
            <div>Progress</div>
            <div>{progressUploadToServer} %</div>
          </div>
          <div className='flex-1 mr-2'>
            <div>Time</div>
            <div>{fileItem.totalTime || statisticsUploading?.totalTime || '1'}</div>
          </div>
          <div className='flex-1 mr-2'>
            <div>Rate</div>
            <div>{(fileItem.speed || statisticsUploading?.speed || 1)?.toFixed(2)}MB/s</div>
          </div>
        </div>
      </div>
      {fileItem.state === FILE_STATES.FINISHED && (
        <div className='w-[25%]'>
          <button
            className='border border-primary rounded-lg gap-[7px] flex leading-6 py-[9px] px-[5px] items-center'
            onClick={() => shareFile(fileItem.file)}
          >
            <Image src={copyIcon} alt='file' height={24} />
            <span className='text-xs'>Copy to share</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default UploadedFileItem
