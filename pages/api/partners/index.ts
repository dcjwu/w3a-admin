import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const PostServiceDto = Joi.object({
   name: Joi.string().required(),
   imageUrl: Joi.string().regex(/^https:\/\/public-web3app\.s3\.eu-north-1\.amazonaws\.com\/(.*)/).required(),
   link: Joi.string().uri()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const partners = await prisma.partner.findMany({
            select: {
               id: true,
               name: true,
               imageUrl: true,
               link: true,
               createdAt: true,
               updatedAt: true
            },
            orderBy: { createdAt: "desc" }
         })

         return res.status(200).json(partners)

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .post(validationMiddleware({ body: PostServiceDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { name, imageUrl, link } = req.body

         await prisma.partner.create({
            data: {
               name: name,
               imageUrl: imageUrl,
               link: link
            },
         })

         return res.status(201).json({ message: "Partner created" })

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