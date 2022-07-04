import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export const middleware = async (req: NextRequest): Promise<NextResponse> => {
   
   const { origin } = req.nextUrl
   const token = await getToken({ req, secret })

   if (!token) {
      if (req.url.includes("/admin") || req.url.includes("/auth/logout")) {
         return NextResponse.redirect(`${origin}/`)
      }
   } else {
      if (req.url.includes("/auth/login")) {
         return NextResponse.redirect(`${origin}/admin`)
      }
   }

   return NextResponse.next()
}