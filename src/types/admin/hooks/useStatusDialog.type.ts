import type { StatusDialogInitialStateType } from "@customTypes/admin/constants"

export type UseStatusDialogType = [
   StatusDialogInitialStateType,
   string,
   (value: boolean) => void,
   (error?: string | undefined) => void,
   (value: string, toClose?: boolean | undefined) => void
]
