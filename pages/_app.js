import React from 'react';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { StateContext } from '../context/StateContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <StateContext>
        <Layout>
          <Toaster />
          <Component {...pageProps} />
        </Layout>
      </StateContext>
    </AuthProvider>
  );
}

export default MyApp;