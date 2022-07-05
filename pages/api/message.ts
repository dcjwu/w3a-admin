import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

import { prisma } from "@lib/prisma"

const secret = process.env.NEXTAUTH_SECRET

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
   if (req.method === "GET") {
      try {
         const token = await getToken({ req, secret })
         if (!token) return res.status(401).json({ message: "Unauthorized" })

         const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } })

         return res.status(200).json({ messages })
      } catch (err) {
         console.log(err)
         return res.status(400).json({ message: err })
      }
   }

   else if (req.method === "POST") {
      try {
         const incomingMessage = req.body

         await prisma.message.create({
            data: {
               name: incomingMessage.name,
               email: incomingMessage.email,
               topic: incomingMessage.topic,
               text: incomingMessage.text,
               ipAddress: req.socket.remoteAddress
            }
         })
         
         return res.status(200).json({ message: "Message sent" })
      } catch (err) {
         console.log(err)
         return res.status(400).json({ message: err })
      }
   }

   else {
      return res.status(405).json({ message: "Method not allowed" })
   }
}