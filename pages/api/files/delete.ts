import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { s3 } from "@services/aws"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { bodyParser: { sizeLimit: "1mb" }, externalResolver: true } }

const PostFileDeleteDto = Joi.object({ key: Joi.string().required(), })

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .post(validationMiddleware({ body: PostFileDeleteDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const bucketName = process.env.AWS_BUCKET_NAME
         const { key } = req.body

         if (bucketName) {
            const params = {
               Bucket: bucketName,
               Key: key
            }

            s3.deleteObject(params, (err, data) => {
               if (err) return res.status(400).json({ message: err.message })

               return res.status(200).json(data)
            })

         } else return res.status(400).json({ message: "Bucket name is not defined" })

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