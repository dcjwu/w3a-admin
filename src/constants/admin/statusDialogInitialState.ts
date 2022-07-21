import type { StatusDialogInitialStateType } from "@customTypes/admin/common"

export const statusDialogInitialState: StatusDialogInitialStateType = {
   loading: false,
   error: false,
   success: false,
   alertSuccess: false,
   alertError: false,
   alertWarn: false,
}