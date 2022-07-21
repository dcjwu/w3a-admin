import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const bcrypt = require("bcrypt") // eslint-disable-line @typescript-eslint/no-var-requires

export const config = { api: { externalResolver: true } }

const PatchUserDto = Joi.object({
   id: Joi.string().required(),
   oldPassword: Joi.string().required(),
   newPassword: Joi.string().required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .patch(validationMiddleware({ body: PatchUserDto }), async (req: NextApiRequest, res: NextApiResponse) => {
      try {
         const { id, oldPassword, newPassword } = req.body

         if (typeof id === "string") {
            const user = await prisma.user.findUnique({ where: { id: id }, })
            if (!user) return res.status(404).json({ message: "User not found" })

            const isPasswordCorrect = await bcrypt.compareSync(oldPassword, user.password)
            if (!isPasswordCorrect) return res.status(422).json({ message: "Incorrect password" })

            const newPasswordHash = await bcrypt.hashSync(newPassword, 10)

            await prisma.user.update({
               where: { id: id },
               data: { password: newPasswordHash }
            })

            res.status(200).json({ message: "Password updated successfully" })
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
   