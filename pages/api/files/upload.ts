import Joi from "joi"
import { createRouter } from "next-connect"

import { validationMiddleware } from "@lib/admin/middlewares"
import { authMiddleware } from "@lib/admin/middlewares/authentication"
import { s3 } from "@services/aws"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } }

const PostFileUploadDto = Joi.object({
   name: Joi.string().required(),
   type: Joi.string().valid("image/svg+xml", "image/webp").required()
})

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .post(validationMiddleware({ body: PostFileUploadDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {

         const { name, type } = req.body
         
         const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: name,
            Expires: 60,
            ContentType: type,
            ACL: "public-read"
         }
         
         const url = await s3.getSignedUrlPromise("putObject", params)
         
         return res.status(200).json({ url })

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