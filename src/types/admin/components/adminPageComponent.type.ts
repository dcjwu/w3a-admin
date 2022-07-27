import React from "react"

import type { PageDataType, ServerErrorMessageType } from "@customTypes/admin/common"

export type AdminPageComponentType = {
   data: PageDataType,
   serverErrorMessage: ServerErrorMessageType,
   initialValues: {[k: string]: string},
   endpoint: string,
   name: string,
   editableFields: string[],
   children: React.ReactNode
}