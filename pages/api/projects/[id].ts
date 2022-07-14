import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const PortfolioIdDto = Joi.object({ id: Joi.string().uuid().required() })

const PatchPortfolioDto = Joi.object({
   projectName: Joi.string(),
   description: Joi.string(),
   imageUrl: Joi.string().uri(),
   keywords: Joi.array()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .patch(validationMiddleware({ query: PortfolioIdDto, body: PatchPortfolioDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query
         const { projectName, description, imageUrl, keywords } = req.body

         if (typeof id === "string") {
            const portfolio = await prisma.portfolio.findUnique({ where: { id: id } })

            if (!portfolio) return res.status(404).json({ message: "Portfolio item not found" })

            await prisma.portfolio.update({
               where: { id: id },
               data: {
                  projectName: projectName,
                  description: description,
                  imageUrl: imageUrl,
                  keywords: keywords
               }
            })
         }

         return res.status(200).json({ message: "Portfolio item updated successfully" })

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .delete(validationMiddleware({ query: PortfolioIdDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query

         if (typeof id === "string") {
            const portfolio = await prisma.portfolio.findUnique({ where: { id: id } })

            if (!portfolio) return res.status(404).json({ message: "Portfolio item not found" })

            await prisma.portfolio.delete({ where: { id: id } })
         }

         return res.status(200).json({ message: "Portfolio item deleted successfully" })

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