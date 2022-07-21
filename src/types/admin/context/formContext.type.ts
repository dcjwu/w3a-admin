import React from "react"

import { FormDataType } from "@customTypes/admin/common"

export type FormContextType = {
   formData: FormDataType,
   handleFormChange?: ((event: React.SyntheticEvent<Element, Event>) => void)
}