import Joi from "joi"
import { createRouter } from "next-connect"

import { authMiddleware, validationMiddleware } from "@lib/admin/middlewares"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const router = createRouter<NextApiRequest, NextApiResponse>()

const TicketIdDto = Joi.object({ id: Joi.string().uuid().required() })

const PatchTicketDto = Joi.object({ status: Joi.string().valid("CLOSED", "ACTIVE") })

router
   .use(authMiddleware)

   .patch(validationMiddleware({ query: TicketIdDto, body: PatchTicketDto }), async (req: NextApiRequest, res: NextApiResponse) => {
      try {
         const { id } = req.query
         const { status } = req.body

         if (typeof id === "string") {
            const ticket = await prisma.ticket.findUnique({ where: { id: id } })

            if (!ticket) return res.status(404).json({ message: "Ticket not found" })

            if (ticket.status === status) return res.status(422).json({ message: `Status is already ${status}` })

            await prisma.ticket.update({
               where: { id: id },
               data: { status: status }
            })
         }

         return res.status(200).json({ message: "Ticket updated successfully" })

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