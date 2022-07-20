import React from "react"

import { mainDialogInitialState } from "@constants/admin/mainDialogInitialState"

import type { UseMainDialogType } from "@customTypes/admin/hooks"

export const useMainDialog = (): UseMainDialogType => {
   const [isModalOpen, setIsModalOpen] = React.useState(mainDialogInitialState)

   const toggleMainModal = (key: string, show: boolean): void => {
      setIsModalOpen({
         ...isModalOpen,
         [key]: show
      })
   } //TODO: useCallback/useMemo usage?

   return [isModalOpen, toggleMainModal]
}

