import { NextApiRequest, NextApiResponse } from "next"
import { createRouter } from "next-connect"

import { authMiddleware } from "@lib/admin/middlewares"
import { s3 } from "@services/aws"

const router = createRouter<NextApiRequest, NextApiResponse>()

//TODO: Fix stalled requests warning in this folder

router
   .use(authMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
         const bucketName = process.env.AWS_BUCKET_NAME

         if (bucketName) {
            const params = {
               Bucket: bucketName,
               Delimiter: "/"
            }

            s3.listObjects(params, (err, data) => {
               if (err) return res.status(400).json({ message: err.message })

               return res.status(200).json(data.Contents)
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