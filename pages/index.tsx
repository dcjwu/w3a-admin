import type { NextPage } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"

const Home: NextPage = () => {

   const {
      data,
      status
   } = useSession()

   return (
      <>
         <Head>
            <title>Web3App.agency | Main</title>
            <meta content="Web3App.agency Website 2022" name="description"/>
            <link href="/public/favicon.ico" rel="icon"/>
         </Head>

         {
            status === "authenticated" ? <h1>Auth :),&nbsp;{data?.user?.name}</h1> : <h1>Not auth :(</h1>
         }
      </>

   )
}

export default Home
