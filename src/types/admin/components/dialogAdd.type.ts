import type React from "react"
import type { FormEvent , MouseEventHandler } from "react"

export type DialogAddType = {
   isOpen: boolean,
   title: string,
   description: string,
   handleCloseDialog: MouseEventHandler<HTMLButtonElement>
   children: React.ReactNode
}