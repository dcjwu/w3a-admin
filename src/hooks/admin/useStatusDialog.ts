import React from "react"

import { statusDialogInitialState } from "@constants/admin/statusDialogInitialState"

import type { UseStatusType } from "@customTypes/admin/hooks"

export const useStatusDialog = (): UseStatusType => {
   const [isModalOpen, setIsModalOpen] = React.useState(statusDialogInitialState)
   const [error, setError] = React.useState("")

   const toggleStatusModal = (key: string, show: boolean): void => {
      setIsModalOpen({
         ...isModalOpen,
         [key]: show
      })
   }

   const toggleLoading = (value: boolean): void => {
      toggleStatusModal("loading", value)
   }

   const toggleError = (error?: string): void => {
      if (error) {
         setError(error)
         toggleStatusModal("error", true)
      } else {
         setError("")
         toggleStatusModal("error", false)
      }
   }

   const toggleAlert = (value: string, toClose?: boolean): void => {
      if (!toClose) {
         toggleStatusModal(value, true)
      } else {
         toggleStatusModal(value, false)
      }
   }

   return [isModalOpen, error, toggleLoading, toggleError, toggleAlert]
}