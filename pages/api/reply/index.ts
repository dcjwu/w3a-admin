import Joi from "joi"
import { createRouter } from "next-connect"

import { authMiddleware, validationMiddleware } from "@lib/admin/middlewares"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const PostReplyDto = Joi.object({
   ticketId: Joi.string().uuid().required(),
   recipientEmail: Joi.string().email().required(),
   subject: Joi.string().required(),
   message: Joi.string().required(),
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .post(validationMiddleware({ body: PostReplyDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const {
            ticketId,
            recipientEmail,
            subject,
            message
         } = req.body

         const ticket = await prisma.ticket.findUnique({ where: { id: ticketId }, include: { reply: true } })

         if (!ticket) return res.status(404).json({ message: "Ticket not found" })

         if (ticket.reply) return res.status(409).json({ message: "One reply per ticket is allowed" })

         await prisma.ticket.update({
            where: { id: ticketId },
            data: {
               status: "REPLIED",
               reply: {
                  upsert: {
                     create: {
                        recipientEmail: recipientEmail,
                        subject: subject,
                        message: message
                     },
                     update: {
                        recipientEmail: recipientEmail,
                        subject: subject,
                        message: message
                     }
                  }
               }
            }
         })

         return res.status(201).json({ message: "Reply created" })

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