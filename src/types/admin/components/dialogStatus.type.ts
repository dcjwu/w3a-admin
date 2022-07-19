import { MouseEventHandler } from "react"

export enum DialogStatusEnum {
   LOADING,
   SUCCESS,
   ERROR
}

export type DialogStatusType = {
   status: DialogStatusEnum,
   isOpen: boolean,
   handleCloseDialog: MouseEventHandler<HTMLButtonElement>,
   error?: string
}