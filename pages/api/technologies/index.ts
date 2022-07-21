import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const PostTechnologyDto = Joi.object({
   name: Joi.string().required(),
   imageUrl: Joi.string().regex(/^https:\/\/public-web3app\.s3\.eu-north-1\.amazonaws\.com\/(.*)/).required(),
   link: Joi.string().uri()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const technologies = await prisma.technology.findMany({
            select: {
               id: true,
               name: true,
               imageUrl: true,
               link: true,
               createdAt: true
            },
            orderBy: { createdAt: "desc" }
         })

         return res.status(200).json(technologies)

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .post(validationMiddleware({ body: PostTechnologyDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { name, imageUrl, link } = req.body

         await prisma.technology.create({
            data: {
               name: name,
               imageUrl: imageUrl,
               link: link
            },
         })

         return res.status(201).json({ message: "Technology created" })

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