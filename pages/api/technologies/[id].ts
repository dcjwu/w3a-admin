import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const TechnologyIdDto = Joi.object({ id: Joi.string().uuid().required() })

const PatchTechnologyDto = Joi.object({
   name: Joi.string(),
   imageUrl: Joi.string().uri(),
   link: Joi.string().uri()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .patch(validationMiddleware({ query: TechnologyIdDto, body: PatchTechnologyDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query
         const { name, imageUrl, link } = req.body

         if (typeof id === "string") {
            const technology = await prisma.technology.findUnique({ where: { id: id } })

            if (!technology) return res.status(404).json({ message: "Technology not found" })

            await prisma.technology.update({
               where: { id: id },
               data: {
                  name: name,
                  imageUrl: imageUrl,
                  link: link
               }
            })
         }

         return res.status(200).json({ message: "Technology updated successfully" })

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .delete(validationMiddleware({ query: TechnologyIdDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query

         if (typeof id === "string") {
            const technology = await prisma.technology.findUnique({ where: { id: id } })

            if (!technology) return res.status(404).json({ message: "Technology not found" })

            await prisma.technology.delete({ where: { id: id } })
         }

         return res.status(200).json({ message: "Technology deleted successfully" })

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