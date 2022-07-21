import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const MemberIdDto = Joi.object({ id: Joi.string().uuid().required() })

const PatchMemberDto = Joi.object({
   name: Joi.string(),
   title: Joi.string(),
   imageUrl: Joi.string().regex(/^https:\/\/public-web3app\.s3\.eu-north-1\.amazonaws\.com\/(.*)/).required(),
   socialMediaLinks: Joi.array().items(Joi.string().uri())
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .patch(validationMiddleware({ query: MemberIdDto, body: PatchMemberDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query
         const { name, title, imageUrl, socialMediaLinks } = req.body

         if (typeof id === "string") {
            const member = await prisma.member.findUnique({ where: { id: id } })

            if (!member) return res.status(404).json({ message: "Member not found" })

            await prisma.member.update({
               where: { id: id },
               data: {
                  name: name,
                  title: title,
                  imageUrl: imageUrl,
                  socialMediaLinks: socialMediaLinks
               }
            })
         }

         return res.status(200).json({ message: "Member updated successfully" })

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .delete(validationMiddleware({ query: MemberIdDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query

         if (typeof id === "string") {
            const member = await prisma.member.findUnique({ where: { id: id } })

            if (!member) return res.status(404).json({ message: "Member not found" })

            await prisma.member.delete({ where: { id: id } })
         }

         return res.status(200).json({ message: "Member deleted successfully" })

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