import '../styles/globals.css'

import { SessionProvider } from "next-auth/react"
import { getServerSession } from "next-auth/react";
import { useState } from 'react';
import Router from 'next/router';
import Loading from '../../components/loading';



function MyApp({ Component, pageProps: { session, ...pageProps }, }) {

  const [loading, setLoading] = useState(false);
  console.log(loading)

  Router.events.on('routeChangeStart', () => setLoading(true));
  Router.events.on('routeChangeComplete', () => {
    setTimeout(() => {
      setLoading(false)
    } , 1000)
  });

  return (
    <>
      <SessionProvider session={session}>
        {
          loading && <Loading />
        }
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp