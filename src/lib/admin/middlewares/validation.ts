import withJoi from "next-joi"

import type { ValidationError } from "joi"
import type { NextApiRequest, NextApiResponse } from "next"

export const validationMiddleware = withJoi({
   onValidationError: (_: NextApiRequest, res: NextApiResponse, err: ValidationError) => {
      res.status(400).json(err.details)
   }
})