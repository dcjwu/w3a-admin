import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const schema = Joi.object({
   name: Joi.string().required(),
   description: Joi.string().required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } })

         return res.status(200).json(services)
      } catch (err) {
         console.log(err)
         return res.status(400).json({ message: err })
      }
   })
   
   .post(validationMiddleware({ body: schema }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const service = req.body

         await prisma.service.create({
            data: {
               name: service.name,
               description: service.description
            },
         })

         return res.status(200).json({ message: "Service created" })

      } catch (err) {
         console.log(err)
         return res.status(400).json({ message: err })
      }
   })

export default router.handler({
   onError: (err: unknown, req: NextApiRequest, res: NextApiResponse) => {
      console.error(err)
      res.status(500).end("Internal server error")
   },
   onNoMatch: (req, res) => {
      res.status(404).end("Not found")
   },
})