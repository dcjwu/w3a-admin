import type { MainDialogInitialStateType } from "@customTypes/admin/common"

export type DialogToggleType = (key: string, show: boolean) => void

export type UseMainDialogType = [
   MainDialogInitialStateType,
   DialogToggleType
]