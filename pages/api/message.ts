import Joi from "joi"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { createRouter } from "next-connect"


import { validationMiddleware } from "@lib/admin/middlewares"
import { prisma } from "@lib/prisma"

const secret = process.env.NEXTAUTH_SECRET

const schema = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().email().required(),
   topic: Joi.string().required(),
   text: Joi.string().required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const token = await getToken({
            req,
            secret
         })
         if (!token) return res.status(401).json({ message: "Unauthorized" })

         const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } })

         return res.status(200).json({ messages })
      } catch (err) {
         console.log(err)
         return res.status(400).json({ message: err })
      }
   })
   .post(validationMiddleware({ body: schema }), async (req: NextApiRequest, res: NextApiResponse) => {
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
   })

export default router.handler({
   onError: (err: unknown, req: NextApiRequest, res: NextApiResponse) => {
      console.error(err)
      res.status(500).end("Internal server error")
   },
   onNoMatch: (req, res) => {
      res.status(404).end("Not found")
   },
})