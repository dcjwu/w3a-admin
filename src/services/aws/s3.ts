import { S3 } from "aws-sdk"

export const s3 = new S3({
   region: process.env.AWS_REGION,
   accessKeyId: process.env.AWS_ACCESS_KEY,
   secretAccessKey: process.env.AWS_SECRET_KEY,
   signatureVersion: "v4"
})