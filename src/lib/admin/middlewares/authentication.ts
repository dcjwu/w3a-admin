import { NextRequest } from "next/server"

export const middleware = async (req: NextRequest): Promise<void> => {
   console.log(req, "LOG REQ")
}