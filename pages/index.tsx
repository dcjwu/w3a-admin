import type { NextPage } from "next"
import { useSession } from "next-auth/react"

const Home: NextPage = () => {

   const {
      data,
      status
   } = useSession()

   return (
      <>
         {status === "authenticated"
            ? <h1>Auth :),&nbsp;{data?.user?.name}</h1>
            : <h1>Not auth :(</h1>}
      </>

   )
}

export default Home
