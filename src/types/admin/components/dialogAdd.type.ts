import type React from "react"
import type { FormEvent, MouseEventHandler } from "react"

export type DialogAddType = {
   isOpen: boolean,
   isButtonDisabled: boolean,
   title: string,
   description: string,
   handleCloseDialog: MouseEventHandler<HTMLButtonElement>
   handleSubmitForm: (event: FormEvent<HTMLFormElement>) => void
   children: React.ReactNode
}