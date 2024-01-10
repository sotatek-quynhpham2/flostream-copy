import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import FlostreamLogo from '@/assets/images/flostream-white.png';

export const Header = () => {
  return (
    <div
      id="header"
      className="flex flex-row justify-between items-center h-[60px] px-6 py-[10px] bg-[#292929]"
    >
      <Link href="/">
        <Image src={FlostreamLogo} height={18} alt="FlostreamLogo" priority />
      </Link>
    </div>
  );
};
