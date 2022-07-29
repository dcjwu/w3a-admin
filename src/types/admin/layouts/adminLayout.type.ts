import type React from "react"

import type { ServerErrorMessageType } from "@customTypes/admin/common"

export type AdminLayoutType = {
   children: React.ReactNode,
   serverError: ServerErrorMessageType
}