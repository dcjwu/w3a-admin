import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const ServiceIdDto = Joi.object({ id: Joi.string().uuid().required() })

const PatchServiceDto = Joi.object({
   name: Joi.string(),
   description: Joi.string()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .patch(validationMiddleware({ query: ServiceIdDto, body: PatchServiceDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query
         const { name, description } = req.body

         if (typeof id === "string") {
            const service = await prisma.service.findUnique({ where: { id: id } })

            if (!service) return res.status(404).json({ message: "Service not found" })

            await prisma.service.update({
               where: { id: id },
               data: {
                  name: name,
                  description: description
               }
            })
         }

         return res.status(200).json({ message: "Service updated successfully" })

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .delete(validationMiddleware({ query: ServiceIdDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query

         if (typeof id === "string") {
            const service = await prisma.service.findUnique({ where: { id: id } })

            if (!service) return res.status(404).json({ message: "Service not found" })

            await prisma.service.delete({ where: { id: id } })
         }

         return res.status(200).json({ message: "Service deleted successfully" })

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