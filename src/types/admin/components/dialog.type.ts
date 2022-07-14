import React, { FormEvent, MouseEventHandler } from "react"


export type DialogFormType = {
   isOpen: boolean,
   title: string,
   description: string,
   handleCloseDialog: MouseEventHandler<HTMLButtonElement>
   handleSubmitForm: (event: FormEvent<HTMLFormElement>) => void
   children: React.ReactNode
}