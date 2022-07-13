import React from "react"

import type { ServerErrorMessageType } from "@customTypes/admin/common"

export type AdminViewType = {
   children: React.ReactNode,
   serverError: ServerErrorMessageType
}