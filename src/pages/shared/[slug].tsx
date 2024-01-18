import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DefaultLayout as Layout } from '@/layouts/default';
import moment from 'moment';
import { toast } from 'react-toastify';

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

  const [isExpired, setIsExpired] = useState<boolean>(true);
  const [fileType, setFileType] = useState<any>(ZipIcon);

  useEffect(() => {
    const now = moment();
    const expiredAt = moment(router.query['X-Amz-Date'], 'YYYYMMDDHHmmssZ');
    if (now.isAfter(expiredAt)) {
      setIsExpired(true);
      return;
    }

    setIsExpired(false);
  }, []);

  useEffect(() => {
    const type = slug?.toString().split('.').pop();
    switch (type) {
      case 'pdf':
        setFileType(PdfIcon);
        break;
      case 'docx':
        setFileType(DocxIcon);
        break;
      case 'zip':
        setFileType(ZipIcon);
        break;
      case 'mp3':
        setFileType(AudioIcon);
        break;
      case 'mp4':
        setFileType(VideoIcon);
        break;
      case 'png':
      case 'jpg':
      case 'jpeg':
        setFileType(ImageIcon);
        break;
      default:
        setFileType(ZipIcon);
        break;
    }
  }, [slug]);

  const downloadFile = async () => {
    const bucket = process.env.NEXT_PUBLIC_STORE_BUCKET;
    const file = router.asPath.replace('/shared/', '');
    const url = `https://${bucket}.s3.amazonaws.com/${file}`;
    window.open(url, '_blank');
    // const blob = await fetch(url).then((r) => r.blob());
    // const link = document.createElement('a');
    // link.href = window.URL.createObjectURL(blob);
    // link.download = slug as string;
    // link.click();
  };

  return (
    <Layout>
      <div className="mt-[30px] bg-white rounded-xl w-full md:w-[420px] max-w-[420px] p-6 md:px-[60px] md:py-[50px] flex flex-col gap-5 justify-center items-center">
        {isExpired ? (
          <>
            <Image src={DataExpiredIcon} alt="DataExpiredIcon" height={100} />
            <div className="text-neutral-2 text-[14px] font-normal leading-normal">
              The file is no longer available.
            </div>
          </>
        ) : (
          <>
            <div className="text-primary text-[28px] font-medium leading-normal flex items-center justify-center gap-[10px]">
              <Image src={fileType} alt="fileType" height={28} />
              <span className="truncate">{slug}</span>
            </div>
            <div>{router.query.size}</div>
            <div className="text-neutral-2 text-[14px] font-normal leading-normal">
              No preview available
            </div>
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
