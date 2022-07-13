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

const PatchServiceDto = Joi.object({
   id: Joi.string().uuid().required(),
   fieldName: Joi.string().required(),
   newValue: Joi.string().required()
})

enum ServiceFieldName {
   Name = "name",
   Description = "description"
}

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
   
   .patch(validationMiddleware({ body: PatchServiceDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const service = req.body

         if (Object.values(ServiceFieldName).includes(service.fieldName)) {

            if (service.fieldName === ServiceFieldName.Name) {
               await prisma.service.update({
                  where: { id: service.id },
                  data: { name: service.newValue }
               })
            }

            if (service.fieldName === ServiceFieldName.Description) {
               await prisma.service.update({
                  where: { id: service.id },
                  data: { description: service.newValue }
               })
            }

            return res.status(200).json({ message: `${service.fieldName} updated successfully` })

         } else {
            return res.status(422).json({ message: `${service.fieldName} is not recognized` })
         }

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