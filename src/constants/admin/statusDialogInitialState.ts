import type { StatusDialogInitialStateType } from "@customTypes/admin/constants"

export const statusDialogInitialState: StatusDialogInitialStateType = {
   loading: false,
   error: false,
   success: false,
   alertSuccess: false,
   alertError: false,
   alertWarn: false,
}