import Joi from "joi"
import { createRouter } from "next-connect"

import { authMiddleware, validationMiddleware } from "@lib/admin/middlewares"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const PostMessageDto = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().email().required(),
   companyName: Joi.string(),
   topic: Joi.string().required(),
   text: Joi.string().required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .post(validationMiddleware({ body: PostMessageDto }), async (req: NextApiRequest, res: NextApiResponse) => {
      try {
         const { name, email, companyName, topic, text } = req.body

         await prisma.ticket.create({
            data: {
               name: name,
               email: email,
               companyName: companyName,
               topic: topic,
               text: text,
               ipAddress: req.socket.remoteAddress
            },
         })

         return res.status(201).json({ message: "Message sent successfully" })

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const messages = await prisma.ticket.findMany({
            select: {
               id: true,
               name: true,
               email: true,
               companyName: true,
               status: true,
               topic: true,
               text: true,
               ipAddress: true,
               createdAt: true
            },
            orderBy: { createdAt: "desc" },
         })

         return res.status(200).json(messages)

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })


export default router.handler({
   onError: (err: unknown, req: NextApiRequest, res: NextApiResponse) => {
      console.error(err)
      res.status(500).end("Internal server error")
   },
   onNoMatch: (req, res) => {
      res.status(405).end("Method not allowed")
   },
})