import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { prisma } from "@lib/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const ProjectIdDto = Joi.object({ id: Joi.string().uuid().required() })

const PatchProjectDto = Joi.object({
   name: Joi.string(),
   description: Joi.string(),
   imageUrl: Joi.string().uri(),
   keywords: Joi.array()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .patch(validationMiddleware({ query: ProjectIdDto, body: PatchProjectDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query
         const { name, description, imageUrl, keywords } = req.body

         if (typeof id === "string") {
            const project = await prisma.project.findUnique({ where: { id: id } })

            if (!project) return res.status(404).json({ message: "Project not found" })

            await prisma.project.update({
               where: { id: id },
               data: {
                  name: name,
                  description: description,
                  imageUrl: imageUrl,
                  keywords: keywords
               }
            })
         }

         return res.status(200).json({ message: "Project updated successfully" })

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

   .delete(validationMiddleware({ query: ProjectIdDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const { id } = req.query

         if (typeof id === "string") {
            const project = await prisma.project.findUnique({ where: { id: id } })

            if (!project) return res.status(404).json({ message: "Project not found" })

            await prisma.project.delete({ where: { id: id } })
         }

         return res.status(200).json({ message: "Project deleted successfully" })

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