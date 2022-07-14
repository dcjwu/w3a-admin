import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const PostPortfolioDto = Joi.object({
   projectName: Joi.string().required(),
   description: Joi.string().required(),
   imageUrl: Joi.string().uri().required(), //TODO Add AWS S3 link
   keywords: Joi.array().required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const portfolio = await prisma.portfolio.findMany({
            select: {
               id: true,
               projectName: true,
               description: true,
               imageUrl: true,
               keywords: true,
               createdAt: true
            },
            orderBy: { createdAt: "desc" }
         })

         return res.status(200).json(portfolio)

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .post(validationMiddleware({ body: PostPortfolioDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { projectName, description, imageUrl, keywords } = req.body

         await prisma.portfolio.create({
            data: {
               projectName: projectName,
               description: description,
               imageUrl: imageUrl,
               keywords: keywords
            },
         })

         return res.status(201).json({ message: "Portfolio item created" })

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