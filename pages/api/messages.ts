import Joi from "joi"
import { createRouter } from "next-connect"

import { authMiddleware, validationMiddleware } from "@lib/admin/middlewares"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const schema = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().email().required(),
   topic: Joi.string().required(),
   text: Joi.string().required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
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
            },
         })

         return res.status(200).json({ message: "Message sent" })
      } catch (err) {
         console.log(err)
         return res.status(400).json({ message: err })
      }
   })

   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const messages = await prisma.message.findMany({
            orderBy: { createdAt: "desc" },
            select: {
               name: true,
               email: true,
               topic: true,
               text: true,
               ipAddress: true,
               createdAt: true
            }
         })

         return res.status(200).json(messages)
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