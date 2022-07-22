import type { FormDataType } from "@customTypes/admin/common"

export const isObjectChanged = (initialState: FormDataType, currentState: FormDataType): boolean =>
   JSON.stringify(initialState) === JSON.stringify(currentState)