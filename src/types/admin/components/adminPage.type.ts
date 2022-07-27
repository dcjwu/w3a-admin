import React from "react"

import type { PageDataType, ServerErrorMessageType } from "@customTypes/admin/common"

export type AdminPageType = {
   data: PageDataType,
   serverErrorMessage: ServerErrorMessageType,
   initialValues: {[k: string]: string},
   endpoint: string,
   name: string,
   children: React.ReactNode
}