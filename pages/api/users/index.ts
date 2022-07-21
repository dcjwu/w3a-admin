import Joi from "joi"
import { createRouter } from "next-connect"

import { authMiddleware, validationMiddleware } from "@lib/admin/middlewares"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const bcrypt = require("bcrypt") // eslint-disable-line @typescript-eslint/no-var-requires

export const config = { api: { externalResolver: true } }

const PostUserDto = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().required().email(), //TODO: In future add web3app.agency domain
   password: Joi.string().required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const users = await prisma.user.findMany({
            select: {
               id: true,
               name: true,
               email: true,
               imageUrl: true,
               createdAt: true
            },
            orderBy: { createdAt: "desc" }
         })

         return res.status(200).json(users)

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .post(validationMiddleware({ body: PostUserDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { name, email, password } = req.body
         
         const user = await prisma.user.findUnique({ where: { email: email } })
         if (user) return res.status(409).json({ message: "User already exists" })
         
         const passwordHash = await bcrypt.hashSync(password, 10)
         await prisma.user.create({
            data: {
               email: email,
               name: name,
               password: passwordHash
            }
         })

         return res.status(201).json({ message: "User created" })

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