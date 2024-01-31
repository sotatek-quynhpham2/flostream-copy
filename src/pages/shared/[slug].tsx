import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DefaultLayout as Layout } from '@/layouts/default';
import moment from 'moment';
import { toast } from 'react-toastify';
import { bytesToSize } from '@/utils';

import Image from 'next/image';
import AudioIcon from '@/assets/icons/audio.png';
import DocxIcon from '@/assets/icons/docx.png';
import ImageIcon from '@/assets/icons/image.png';
import PdfIcon from '@/assets/icons/pdf.png';
import VideoIcon from '@/assets/icons/video.png';
import ZipIcon from '@/assets/icons/zip.png';
import DataExpiredIcon from '@/assets/icons/data-expired.png';
import DownloadIcon from '@/assets/icons/download.svg';

const PreviewPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const dataQuery = router.query as any;

  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [fileType, setFileType] = useState<any>(ZipIcon);
  const [isMp4, setIsMp4] = useState<boolean>(false);
  const [isImage, setIsImage] = useState<boolean>(false);
  const [s3AssetUrl, setS3AssetUrl] = useState<string>('');

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
        setFileType(PdfIcon);
        break;
      case 'docx':
      case 'doc':
        setFileType(DocxIcon);
        break;
      case 'zip':
      case 'rar':
        setFileType(ZipIcon);
        break;
      case 'mp3':
      case 'wav':
        setFileType(AudioIcon);
        break;
      case 'mp4':
        setFileType(VideoIcon);
        setIsMp4(true);
        break;
      case 'mov':
      case 'avi':
      case 'mkv':
        setFileType(VideoIcon);
        break;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'webp':
        setIsImage(true);
        setFileType(ImageIcon);
        break;
      case 'heic':
      case 'heif':
        setFileType(ImageIcon);
        break;
      default:
        setFileType(ZipIcon);
        break;
    }
  }, [slug]);

  const downloadFile = async () => {
    const response = await fetch(s3AssetUrl);
    if (response.status !== 200) {
      console.error(response.status, response.statusText);
    }

    if (isMp4 || isImage) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = slug ? slug.toString() : 'flostream';
      link.click();
    } else {
      window.open(s3AssetUrl, '_blank');
    }
  };

  return (
    <Layout>
      <div className="mt-[30px] bg-white rounded-xl max-w-[1200px] mx-auto p-6 md:px-[60px] md:py-[50px] flex flex-col gap-5 justify-center items-center text-center">
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
                <Image src={fileType} alt="fileType" height={28} />
                <span className=" text-primary w-full">{slug}</span>
              </div>
              <div className="text-neutral-2 text-[24px] ">
                {bytesToSize(dataQuery.size)}
              </div>
            </div>
            {isMp4 ? (
              <video src={s3AssetUrl} controls className="max-w-full" />
            ) : isImage ? (
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
      </div>
    </Layout>
  );
};

export default PreviewPage;
