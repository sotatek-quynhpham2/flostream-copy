import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DefaultLayout as Layout } from '@/layouts/default';
import moment from 'moment';
import { toast } from 'react-toastify';
import { bytesToSize } from '@/utils';

import Image from 'next/image';
import AudioIcon from '@/assets/icons/audio.png';
import DocxIcon from '@/assets/icons/docx.svg';
import ImageIcon from '@/assets/icons/image.png';
import PdfIcon from '@/assets/icons/pdf.svg';
import VideoIcon from '@/assets/icons/video.svg';
import ZipIcon from '@/assets/icons/zip.png';
import DataExpiredIcon from '@/assets/icons/data-expired.png';
import DownloadIcon from '@/assets/icons/download.svg';
import LoadingIcon from '@/assets/icons/loading.svg';

const PreviewPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const dataQuery = router.query as any;

  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [iconType, setIconType] = useState<any>(ZipIcon);
  const [videoPreviewable, setVideoPreviewable] = useState<boolean>(false);
  const [imagePreviewable, setImagePreviewable] = useState<boolean>(false);
  const [s3AssetUrl, setS3AssetUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const createdAt = moment(
      dataQuery['X-Amz-Date'],
      'YYYYMMDDHHmmssZ'
    ).toDate();

    if (createdAt) {
      const expiresAt = moment(createdAt).add(2, 'day').toDate();
      if (moment().isAfter(expiresAt)) {
        setIsExpired(true);
        toast.error('The file is no longer available.');
      }
    }
  }, [dataQuery]);

  useEffect(() => {
    const type = slug?.toString().split('.').pop()?.toLowerCase();
    const bucket = process.env.NEXT_PUBLIC_STORE_BUCKET;
    const file = router.asPath.replace('/shared/', '').split('&size=')[0];
    const url = `https://${bucket}.s3.amazonaws.com/${file}`;
    setS3AssetUrl(url);
    switch (type) {
      case 'pdf':
        setIconType(PdfIcon);
        break;
      case 'docx':
      case 'doc':
        setIconType(DocxIcon);
        break;
      case 'mp3':
      case 'wav':
        setIconType(AudioIcon);
        break;
      case 'mp4':
      case 'webm':
      case 'ogg':
        setIconType(VideoIcon);
        setVideoPreviewable(true);
        break;
      case 'mov':
      case 'avi':
      case 'mkv':
        setIconType(VideoIcon);
        break;
      case 'png':
      case 'apng':
      case 'jpg':
      case 'jpeg':
      case 'jfif':
      case 'pjpeg':
      case 'pjp':
      case 'gif':
      case 'svg':
      case 'webp':
      case 'avif':
      case 'tif':
      case 'ico':
      case 'cur':
        setImagePreviewable(true);
        setIconType(ImageIcon);
        break;
      case 'tiff':
      case 'heic':
      case 'heif':
        setIconType(ImageIcon);
        break;
      default:
        setIconType(ZipIcon);
        break;
    }
  }, [slug]);

  const downloadFile = async () => {
    setIsLoading(true);
    const response = await fetch(s3AssetUrl);
    const blob = await response.blob();
    setIsLoading(false);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = slug ? slug.toString() : 'flostream';
    link.click();
  };

  return (
    <Layout>
      <div className="relative mt-[30px] bg-white rounded-xl max-w-[1200px] mx-auto p-6 md:px-[60px] md:py-[50px] flex flex-col gap-5 justify-center items-center text-center">
        {isExpired ? (
          <>
            <Image
              src={DataExpiredIcon}
              alt="DataExpiredIcon"
              height={100}
              priority
            />
            <div className="text-neutral-2 text-[14px] font-normal leading-normal">
              The file is no longer available.
            </div>
          </>
        ) : (
          <>
            <div className="font-medium">
              <div className="text-[28px] leading-normal flex items-center justify-center gap-[10px]">
                <Image src={iconType} alt="iconType" height={28} className="object-contain" />
                <span className=" text-primary w-full">{slug}</span>
              </div>
              <div className="text-neutral-2 text-[24px] ">
                {bytesToSize(dataQuery.size)}
              </div>
            </div>
            {videoPreviewable ? (
              <video src={s3AssetUrl} controls className="max-w-full" />
            ) : imagePreviewable ? (
              <img src={s3AssetUrl} className="max-w-full" alt="Preview" />
            ) : (
              <div className="text-neutral-2 text-[14px] font-normal leading-normal">
                No preview available
              </div>
            )}

            <button
              className="bg-primary text-white rounded-[10px] py-2 px-6 text-[16px] font-medium flex justify-center items-center gap-2"
              onClick={() => downloadFile()}
            >
              <Image src={DownloadIcon} alt="Download" height={16} />
              Download
            </button>
          </>
        )}
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
            <Image
              src={LoadingIcon}
              alt="Loading"
              height={120}
              className="animate-spin max-md:w-[50px]"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PreviewPage;
