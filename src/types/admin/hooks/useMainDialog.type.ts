import type { MainDialogInitialStateType } from "@customTypes/admin/common"

export type UseMainDialogType = [
   MainDialogInitialStateType,
   (key: string, show: boolean) => void
]