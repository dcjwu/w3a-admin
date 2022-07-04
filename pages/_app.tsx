import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import Head from "next/head"

const MyApp = ({
   Component,
   pageProps
}: AppProps): JSX.Element => {

   return (
      <>
         <Head>
            <title>Web3App Agency | High Quality Blockchain Development</title>
            <meta content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0"
                  name="viewport"/>
            <meta charSet="utf-8"/>
            <meta content="en" httpEquiv="content-language"/>
            <meta content="Web3App Agency is a custom software development company that delivers top-level solutions"
                  name="description"/>
            <link href="/favicon.ico" rel="icon"/>
         </Head>
         <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
         </SessionProvider>
      </>
   )
}
export default MyApp
