// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
   if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" })

   try {
      const token = await getToken({ req, secret })
      if (!token) return res.status(401).json({ message: "Unauthorized" })

      return res.status(200).json({ hey: "hello" })
   } catch (err) {
      console.log(err)
      return res.status(400).json({ message: err })
   }
}
