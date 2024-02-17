import copyIcon from '@/assets/icons/copy-alt.svg'
import FileItemIcon from '@/assets/icons/file-item.svg'
import { bytesToSize, formatTimeUpload } from '@/utils'
import { BatchItem, FILE_STATES, useItemStartListener } from '@rpldy/uploady'
import Image from 'next/image'
import { useMemo, useRef } from 'react'
import { toast } from 'react-toastify'

interface Props {
  fileItem: BatchItem
}

function UploadedFileItem({ fileItem }: Props) {
  const timeStart = useRef(Date.now())

  useItemStartListener((item) => {
    timeStart.current = Date.now()
  }, fileItem.id)

  const progressUpload = useMemo(() => {
    // if (![FILE_STATES.UPLOADING].includes(fileItem.state)) return '-'
    return `${Math.round(fileItem.completed)} %`
  }, [fileItem])

  const uploadSpeed = useMemo(() => {
    // if (![FILE_STATES.UPLOADING].includes(fileItem.state)) return '-'
    const time = (Date.now() - timeStart.current) / 1000
    const dataLoaded = fileItem.loaded / (1024 * 1024)
    return `${(dataLoaded / time).toFixed(2)}MB/s`
  }, [fileItem])

  const uploadTime = useMemo(() => {
    // if (![FILE_STATES.UPLOADING].includes(fileItem.state)) return '-'
    const time = (Date.now() - timeStart.current) / 1000

    const dataLoaded = fileItem.loaded
    const fileSize = fileItem.file.size

    return formatTimeUpload((fileSize / dataLoaded) * time)
  }, [fileItem])

  const shareFile = async (file: any) => {
    await fetch('/api/create-presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        objectKey: file.name
      })
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          const slug =
            data.split(process.env.NEXT_PUBLIC_STORE_ENDPOINT + `/${process.env.NEXT_PUBLIC_STORE_BUCKET}/`).pop() +
            `&size=${file.size}`

          const url = `${window.location.origin}/shared/${process.env.NEXT_PUBLIC_STORE_BUCKET}/${slug}`
          navigator.clipboard.writeText(url)
          toast.success('Copied! The presigned url will expire in 24h')
          // tooltipRef1.current?.open({
          //   anchorSelect: '#copied',
          //   content: 'Link copied to clipboard!',
          //   place: 'bottom'
          // })
          file.linkPreUrl = url
        })
      } else {
        res.json().then((data) => {
          toast.error(data.message)
        })
      }
    })
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
              style={{ width: `${fileItem.completed}%` }}
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
            <div>{progressUpload}</div>
          </div>
          <div className='flex-1 mr-2'>
            <div>Time</div>
            <div>{uploadTime}</div>
          </div>
          <div className='flex-1 mr-2'>
            <div>Rate</div>
            <div>{uploadSpeed}</div>
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
