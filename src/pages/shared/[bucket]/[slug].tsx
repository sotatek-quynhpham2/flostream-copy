import { DefaultLayout as Layout } from '@/layouts/default'
import { bytesToSize } from '@/utils'
import moment from 'moment'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import AudioIcon from '@/assets/icons/audio.png'
import DataExpiredIcon from '@/assets/icons/data-expired.png'
import DocxIcon from '@/assets/icons/docx.svg'
import DownloadIcon from '@/assets/icons/download.svg'
import ImageIcon from '@/assets/icons/image.png'
import LoadingIcon from '@/assets/icons/loading.svg'
import PdfIcon from '@/assets/icons/pdf.svg'
import VideoIcon from '@/assets/icons/video.svg'
import ZipIcon from '@/assets/icons/zip.png'
import Image from 'next/image'
import axios from 'axios'
import fileDownload from 'js-file-download'
import { v4 } from 'uuid'

const PreviewPage: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const dataQuery = router.query as any
  const [loading, setLoading] = useState(true)

  const [isExpired, setIsExpired] = useState<boolean>(false)
  const [iconType, setIconType] = useState<any>(ZipIcon)
  const [videoPreviewable, setVideoPreviewable] = useState<boolean>(false)
  const [audioPreviewable, setAudioPreviewable] = useState<boolean>(false)
  const [imagePreviewable, setImagePreviewable] = useState<boolean>(false)
  const [s3AssetUrl, setS3AssetUrl] = useState<string>('')

  useEffect(() => {
    const createdAt = moment(dataQuery['X-Amz-Date'], 'YYYYMMDDHHmmssZ').toDate()

    if (createdAt) {
      const expiresAt = moment(createdAt).add(2, 'day').toDate()
      if (moment().isAfter(expiresAt)) {
        setIsExpired(true)
        toast.error('The file is no longer available.')
      }
    }
  }, [dataQuery])

  useEffect(() => {
    const type = slug?.toString().split('.').pop()?.toLowerCase()
    const file = router.asPath.replace('/shared/', '').split('&size=')[0]
    const url = process.env.NEXT_PUBLIC_STORE_ENDPOINT + `/${file}`
    setS3AssetUrl(url)
    switch (type) {
      case 'pdf':
        setIconType(PdfIcon)
        break
      case 'docx':
      case 'doc':
        setIconType(DocxIcon)
        break
      case 'mp3':
      case 'wav':
      case 'm4a':
      case 'ogg':
        setAudioPreviewable(true)
        setIconType(AudioIcon)
        break
      case 'mp4':
      case 'webm':
        setIconType(VideoIcon)
        setVideoPreviewable(true)
        break
      case 'mov':
      case 'avi':
      case 'mkv':
        setIconType(VideoIcon)
        break
      case 'png':
      case 'apng':
      case 'jpg':
      case 'jpeg':
      case 'jfif':
      case 'pjpeg':
      case 'pjp':
      case 'gif':
      case 'svg':
      case 'ico':
      case 'cur':
      case 'webp':
        setImagePreviewable(true)
        setIconType(ImageIcon)
        break
      case 'avif':
      case 'tif':
      case 'tiff':
      case 'heic':
      case 'heif':
        setIconType(ImageIcon)
        break
      default:
        setIconType(ZipIcon)
        break
    }

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [slug])

  const downloadFile = async () => {
    try {
      const res = await axios.get(s3AssetUrl, {
        responseType: 'blob'
      })
      const fileName = slug ? (slug as string).replace(/\s/g, '') : v4().slice(0, 10)
      fileDownload(res.data, fileName)
    } catch (error) {
      toast.error('failed to download file')
    }
  }

  const isMedia = useMemo(
    () => videoPreviewable || imagePreviewable || audioPreviewable,
    [videoPreviewable, audioPreviewable, imagePreviewable]
  )

  if (loading) {
    return (
      <div className='absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center'>
        <Image src={LoadingIcon} alt='Loading' height={120} className='animate-spin max-md:w-[50px]' />
      </div>
    )
  }

  return (
    <Layout>
      <div className='relative mt-[30px] bg-white rounded-xl max-w-[1200px] mx-auto p-6 md:px-[60px] md:py-[50px] flex flex-col gap-5 justify-center items-center text-center'>
        {isExpired ? (
          <>
            <Image src={DataExpiredIcon} alt='DataExpiredIcon' height={100} priority />
            <div className='text-neutral-2 text-[14px] font-normal leading-normal'>
              The file is no longer available.
            </div>
          </>
        ) : (
          <>
            <div className='font-medium'>
              <div className='text-[28px] leading-normal flex items-center justify-center gap-[10px]'>
                <Image src={iconType} alt='iconType' height={28} className='object-contain' />
                <span className=' text-primary w-full'>{slug}</span>
              </div>
              <div className='text-neutral-2 text-[24px] '>{bytesToSize(dataQuery.size)}</div>
            </div>
            {videoPreviewable ? (
              <video src={s3AssetUrl} controls className='max-w-full' />
            ) : imagePreviewable ? (
              <img src={s3AssetUrl} className='max-w-full' alt='Preview' />
            ) : audioPreviewable ? (
              <audio src={s3AssetUrl} controls className='max-w-full' />
            ) : (
              <div className='text-neutral-2 text-[14px] font-normal leading-normal'>No preview available</div>
            )}

            {isMedia ? (
              <button
                onClick={downloadFile}
                className='bg-primary text-white rounded-[10px] py-2 px-6 text-[16px] font-medium flex justify-center items-center gap-2'
              >
                Download
              </button>
            ) : (
              <a
                className='bg-primary text-white rounded-[10px] py-2 px-6 text-[16px] font-medium flex justify-center items-center gap-2'
                href={s3AssetUrl}
                download={slug || 'file'}
              >
                <Image src={DownloadIcon} alt='Download' height={16} />
                Download
              </a>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default PreviewPage
