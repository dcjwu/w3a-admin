import type { NextPage } from "next"
import Link from "next/link"

const Home: NextPage = (): JSX.Element => {

   return (
      <div>
         <h1>Web3App Public website</h1>
         <div>
            <Link href="/auth/login">
               <a>
                  <button>Login</button>
               </a>
            </Link>
         </div>
      </div>
   )
}

export default Home
