import React from "react"

import { mainDialogInitialState } from "@constants/admin/mainDialogInitialState"

import type { MainDialogInitialStateType } from "@customTypes/admin/constants"
import type { UseMainDialogType } from "@customTypes/admin/hooks"

export const useMainDialog = (): UseMainDialogType => {
   const [isModalOpen, setIsModalOpen] = React.useState<MainDialogInitialStateType>(mainDialogInitialState)

   const toggleMainModal = React.useCallback((key: string, show: boolean): void => {
      setIsModalOpen({
         ...isModalOpen,
         [key]: show
      })
   }, [isModalOpen])

   return [isModalOpen, toggleMainModal]
}

