import { MainDialogInitialStateType } from "@customTypes/admin/constants"

export type UseMainDialogType = [
   MainDialogInitialStateType,
   (key: string, show: boolean) => void
]