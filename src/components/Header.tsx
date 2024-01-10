import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import FlostreamLogo from '@/assets/images/flostream-white.png';

export const Header = () => {
  return (
    <div
      id="header"
      className="flex flex-row justify-between h-[60px] px-6 py-[10px] bg-[#292929]"
    >
      <div className="my-auto h-[18px] flex items-center">
        <Link href="/">
          <Image
            src={FlostreamLogo}
            height={150}
            width={150}
            alt="FlostreamLogo"
          />
        </Link>
      </div>
    </div>
  );
};
