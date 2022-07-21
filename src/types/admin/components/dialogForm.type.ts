import React from "react"
import type { FormEvent, MouseEventHandler } from "react"

import type { FormDataType } from "@customTypes/admin/common"

export type DialogFormType = {
   initialState: FormDataType,
   isButtonDisabled: boolean,
   handleCloseDialog: MouseEventHandler<HTMLButtonElement>,
   handleFormSubmit:  (event: FormEvent<HTMLDivElement>, formData: FormDataType) => void,
   children: React.ReactNode
}