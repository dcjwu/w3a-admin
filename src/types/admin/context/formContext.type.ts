import React from "react"

import type { FormDataType } from "@customTypes/admin/common"
import type { SelectChangeEvent } from "@mui/material/Select"

export type FormContextType = {
   formData: FormDataType,
   handleFormChange?: ((event: React.SyntheticEvent<Element, Event>) => void),
   handleDropdownChange?: (event: SelectChangeEvent) => void
}