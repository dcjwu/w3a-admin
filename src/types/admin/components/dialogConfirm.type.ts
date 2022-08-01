import type React from "react"
import type { MouseEventHandler } from "react"

export type DialogWindowType = {
   isOpen: boolean,
   title: string,
   handleCloseDialog: MouseEventHandler<HTMLButtonElement>
   handleDeleteEntity: MouseEventHandler<HTMLButtonElement>,
   children: React.ReactNode
}