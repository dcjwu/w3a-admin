import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const PostServiceDto = Joi.object({
   name: Joi.string().required(),
   description: Joi.string().required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const services = await prisma.service.findMany({
            select: {
               id: true,
               name: true,
               description: true,
               createdAt: true,
               updatedAt: true
            },
            orderBy: { createdAt: "desc" }
         })

         return res.status(200).json(services)

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })
   
   .post(validationMiddleware({ body: PostServiceDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { name, description } = req.body

         await prisma.service.create({
            data: {
               name: name,
               description: description
            },
         })

         return res.status(201).json({ message: "Service created" })

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