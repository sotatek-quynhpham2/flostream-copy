import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import Flostream from '@/assets/images/flostream.png';
import Logo from '@/assets/images/logo.png';

const Header = () => {
  return (
    <div id="header" className="flex justify-center">
      <Link href="/">
        <div className="flex justify-center items-center gap-4">
          <Image src={Flostream} alt="Flostream" height={36} priority/>
          <Image src={Logo} alt="Logo" height={68} />
        </div>
      </Link>
    </div>
  );
};

export default Header;
