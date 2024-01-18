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

  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [s3Url, setS3Url] = useState<string>('');

  useEffect(() => {
    setIsExpired(false);
    setS3Url(
      process.env.NEXT_PUBLIC_STORE_REGION + '.amazonaws.com' + router.asPath
    );
  }, []);

  const downloadFile = async () => {
    const blob = await fetch(s3Url).then((r) => r.blob());
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = slug as string;
    link.click();
  };

  return (
    <Layout>
      <div className="mt-[30px] bg-white rounded-xl w-full md:w-[420px] max-w-[420px] px-[60px] py-[50px] flex flex-col gap-5 justify-center items-center">
        {isExpired ? (
          <>
            <Image src={DataExpiredIcon} alt="DataExpiredIcon" height={100} />
            <div className="text-neutral-2 text-[14px] font-normal leading-normal">
              The file is no longer available.
            </div>
          </>
        ) : (
          <>
            <div className="text-primary text-[28px] font-medium leading-normal flex items-center justify-center gap-[10px] truncate">
              {slug}
            </div>
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
