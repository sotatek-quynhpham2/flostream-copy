import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const HomePage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/buckets');
  }, []);
  return <></>;
};

export default HomePage;
