import Joi from "joi"
import { createRouter } from "next-connect"

import { authMiddleware, validationMiddleware } from "@lib/admin/middlewares"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const PatchSettingsDto = Joi.object({
   settingName: Joi.string().valid("webhook.url").required(),
   settingValue: Joi.string().when(
      "settingName", {
         is: "webhook.url",
         then: Joi.string().regex(/^https:\/\/api\.vercel\.com\/v1\/integrations\/deploy(.*)/).required()
      }
   )
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const settings = await prisma.settings.findMany({
            select: {
               id: true,
               settingName: true,
               settingValue: true,
               createdAt: true,
               updatedAt: true
            },
            orderBy: { createdAt: "desc" }
         })

         return res.status(200).json(settings)

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .patch(validationMiddleware({ body: PatchSettingsDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { settingName, settingValue } = req.body
         
         const setting = await prisma.settings.findUnique({ where: { settingName: settingName } })

         if (!setting) return res.status(404).json({ message: "Setting not found" })
         
         await prisma.settings.update({
            where: { settingName: settingName },
            data: { settingValue: settingValue }
         })

         return res.status(200).json({ message: `Setting - ${settingName} updated successfully` })

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