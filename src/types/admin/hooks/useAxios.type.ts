import type { FormDataType, StatusDialogInitialStateType } from "@customTypes/admin/common"
import type { DialogToggleType } from "@customTypes/admin/hooks/useMainDialog.type"

export enum RequestMethod {
   POST = "post",
   PATCH = "patch",
   DELETE = "delete"
}

export type UseAxiosType = [
   StatusDialogInitialStateType,
   string,
   (value: boolean) => void,
   (error?: (string | undefined)) => void,
   (method: RequestMethod, endpoint: string, modalToggle: DialogToggleType, formData?: FormDataType) => Promise<void>
]