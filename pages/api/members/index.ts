import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

export const config = { api: { externalResolver: true } }

import type { NextApiRequest, NextApiResponse } from "next"

const PostMemberDto = Joi.object({
   name: Joi.string().required(),
   title: Joi.string().required(),
   imageUrl: Joi.string().regex(/^https:\/\/public-web3app\.s3\.eu-north-1\.amazonaws\.com\/(.*)/).required(),
   socialMediaLinks: Joi.array().items(Joi.string().uri()).required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const members = await prisma.member.findMany({
            select: {
               id: true,
               name: true,
               title: true,
               imageUrl: true,
               socialMediaLinks: true,
               createdAt: true
            },
            orderBy: { createdAt: "desc" }
         })

         return res.status(200).json(members)

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .post(validationMiddleware({ body: PostMemberDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { name, title, imageUrl, socialMediaLinks } = req.body

         await prisma.member.create({
            data: {
               name: name,
               title: title,
               imageUrl: imageUrl,
               socialMediaLinks: socialMediaLinks
            },
         })

         return res.status(201).json({ message: "Member created" })

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