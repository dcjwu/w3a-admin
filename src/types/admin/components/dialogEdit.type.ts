import type { FormEvent, MouseEventHandler } from "react"

import type { EditableRowType, TableColumnsType } from "@customTypes/admin/common"

export type DialogEditType = {
   isOpen: boolean,
   isButtonDisabled: boolean,
   title: string,
   description: string,
   columns: TableColumnsType,
   editableRow: EditableRowType,
   handleCloseDialog: MouseEventHandler<HTMLButtonElement>
   handleSubmitForm: (event: FormEvent<HTMLFormElement>) => void
}