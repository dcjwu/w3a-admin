import type { StatusDialogInitialStateType } from "@customTypes/admin/constants"

export type UseStatusType = [
   StatusDialogInitialStateType,
   string,
   (value: boolean) => void,
   (error?: string | undefined) => void,
   (value: string, toClose?: boolean | undefined) => void
]
