import type { StatusDialogInitialStateType } from "@customTypes/admin/common"

export type UseStatusDialogType = [
   StatusDialogInitialStateType,
   string,
   (value: boolean) => void,
   (error?: string | undefined) => void,
   (value: string, toClose?: boolean | undefined) => void
]
