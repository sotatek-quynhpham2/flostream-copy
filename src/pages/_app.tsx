import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthContext from '@/contexts/AuthContext';

function App({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState<string>('');

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      <Component {...pageProps} />
      <ToastContainer />
    </AuthContext.Provider>
  );
}

export default App;