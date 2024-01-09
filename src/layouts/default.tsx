import Head from "next/head";
import { useRouter } from 'next/router';
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const DefaultLayout = ({ children }: any) => {
  const router = useRouter();
  return (
    <div className="default-layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
