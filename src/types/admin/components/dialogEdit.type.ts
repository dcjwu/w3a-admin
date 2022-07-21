import type { FormEvent, MouseEventHandler } from "react"

export type DialogEditType = {
   isOpen: boolean,
   isButtonDisabled: boolean,
   title: string,
   description: string,
   columns: string[],
   editableRow: { [p: string]: string },
   handleCloseDialog: MouseEventHandler<HTMLButtonElement>
   handleSubmitForm: (event: FormEvent<HTMLFormElement>) => void
}