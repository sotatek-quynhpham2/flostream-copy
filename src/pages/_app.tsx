import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthContext from '@/contexts/AuthContext';

function App({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState<string>('');

  const contextClass = {
    success: "bg-success",
    error: "bg-error",
    info: "bg-gray-600",
    warning: "bg-error",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300",
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      <Component {...pageProps} />
      <ToastContainer toastClassName={(context) =>
        contextClass[context?.type || "default"] +
        " relative flex p-1 mt-2 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
      }
        autoClose={3000}
      />
    </AuthContext.Provider>
  );
}

export default App;