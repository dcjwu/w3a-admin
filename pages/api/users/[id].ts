import Joi from "joi"
import { createRouter } from "next-connect"

import { authMiddleware, validationMiddleware } from "@lib/admin/middlewares"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const UserIdDto = Joi.object({ id: Joi.string().required() })

const PatchUserByIdDto = Joi.object({
   name: Joi.string(),
   email: Joi.string().email(), //TODO: In future add web3app.agency domain
   imageUrl: Joi.string()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(validationMiddleware({ query: UserIdDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query

         if (typeof id === "string") {
            const user = await prisma.user.findUnique({
               where: { id: id },
               select: {
                  id: true,
                  name: true,
                  email: true,
                  imageUrl: true,
                  createdAt: true
               },
            })
            if (!user) return res.status(404).json({ message: "User not found" })

            return res.status(200).json(user)
         }

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })
   
   .patch(validationMiddleware({ query: UserIdDto, body: PatchUserByIdDto }), async (req: NextApiRequest, res: NextApiResponse) => {
      try {
         const { id } = req.query
         const { name, email, imageUrl } = req.body

         if (typeof id === "string") {
            const user = await prisma.user.findUnique({ where: { id: id }, })
            if (!user) return res.status(404).json({ message: "User not found" })

            await prisma.user.update({
               where: { id: id },
               data: {
                  name: name,
                  email: email,
                  imageUrl: imageUrl
               }
            })

            return res.status(200).json({ message: "User updated successfully" })
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