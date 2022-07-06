import { ValidationError } from "joi"
import { NextApiRequest, NextApiResponse } from "next"
import withJoi  from "next-joi"

export const validationMiddleware = withJoi({
   onValidationError: (_: NextApiRequest, res: NextApiResponse, err: ValidationError) => {
      res.status(400).json(err.details)
   }
})