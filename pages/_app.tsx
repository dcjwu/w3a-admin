import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import Head from "next/head"

const MyApp = ({
   Component,
   pageProps
}: AppProps): JSX.Element => {

   return <>
      <Head>
         <meta content="initial-scale=1, width=device-width" name="viewport"/>
         <title>Web3App.agency</title>
      </Head>
      <SessionProvider session={pageProps.session}>
         <Component {...pageProps} />
      </SessionProvider>
   </>
}
export default MyApp
