import type { MouseEventHandler } from "react"
import React from "react"

export type DialogWithInputsType = {
   isOpen: boolean,
   title: string,
   description?: string,
   handleCloseDialog: MouseEventHandler<HTMLButtonElement>
   children: React.ReactNode
}