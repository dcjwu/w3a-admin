import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const PostProjectDto = Joi.object({
   name: Joi.string().required(),
   description: Joi.string().required(),
   imageUrl: Joi.string().regex(/^https:\/\/public-web3app\.s3\.eu-north-1\.amazonaws\.com\/(.*)/).required(),
   keywords: Joi.string().regex(/^[0-9a-zA-Z]+(,\s*[0-9a-zA-Z]+)*$/).required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const project = await prisma.project.findMany({
            select: {
               id: true,
               name: true,
               description: true,
               imageUrl: true,
               keywords: true,
               createdAt: true,
               updatedAt: true
            },
            orderBy: { createdAt: "desc" }
         })

         return res.status(200).json(project)

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .post(validationMiddleware({ body: PostProjectDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { name, description, imageUrl, keywords } = req.body

         await prisma.project.create({
            data: {
               name: name,
               description: description,
               imageUrl: imageUrl,
               keywords: keywords
            },
         })

         return res.status(201).json({ message: "Project created" })

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