import React, { MouseEventHandler } from "react"

export type DialogInfoType = {
   isOpen: boolean,
   handleCloseDialog: MouseEventHandler<HTMLButtonElement>,
   title: string,
   children: React.ReactNode
}