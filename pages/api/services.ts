import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const PostServiceDto = Joi.object({
   name: Joi.string().required(),
   description: Joi.string().required()
})

const PutServiceDto = Joi.object({
   id: Joi.string().uuid().required(),
   name: Joi.string().required(),
   description: Joi.string().required()
})

// const DeleteServiceDto = Joi.object({ id: Joi.string().uuid().required() })

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } })

         return res.status(200).json(services)
      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })
   
   .post(validationMiddleware({ body: PostServiceDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const service = req.body

         await prisma.service.create({
            data: {
               name: service.name,
               description: service.description
            },
         })

         return res.status(201).json({ message: "Service created" })

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })
   
   .put(validationMiddleware({ body: PutServiceDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id, name, description } = req.body
         
         const service = await prisma.service.findUnique({ where: { id: id } })

         if (!service) {
            return res.status(404).json({ message: "Service not found" })

         } else {
            await prisma.service.update({
               where: { id: id },
               data: {
                  name: name,
                  description: description
               }
            })

            return res.status(200).json({ message: "Service updated successfully" })
         }

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

// .delete(validationMiddleware({ body: DeleteServiceDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
//    const id = req.body
//    const service = await prisma
// })

export default router.handler({
   onError: (err: unknown, req: NextApiRequest, res: NextApiResponse) => {
      console.error(err)
      res.status(500).end("Internal server error")
   },
   onNoMatch: (req, res) => {
      res.status(405).end("Method not allowed")
   },
})