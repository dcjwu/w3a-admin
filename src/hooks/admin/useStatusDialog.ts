import React from "react"

import { statusDialogInitialState } from "@constants/admin/statusDialogInitialState"

import type { StatusDialogInitialStateType } from "@customTypes/admin/constants"
import type { UseStatusDialogType } from "@customTypes/admin/hooks"

export const useStatusDialog = (): UseStatusDialogType => {
   const [isModalOpen, setIsModalOpen] = React.useState<StatusDialogInitialStateType>(statusDialogInitialState)
   const [error, setError] = React.useState("")

   const toggleStatusModal = React.useCallback((key: string, show: boolean): void => {
      setIsModalOpen({
         ...isModalOpen,
         [key]: show
      })
   }, [isModalOpen])

   const toggleLoading = React.useCallback((value: boolean): void => {
      toggleStatusModal("loading", value)
   }, [toggleStatusModal])

   const toggleError = React.useCallback((error?: string): void => {
      if (error) {
         setError(error)
         toggleStatusModal("error", true)
      } else {
         setError("")
         toggleStatusModal("error", false)
      }
   }, [toggleStatusModal])

   const toggleAlert = React.useCallback((value: string, toClose?: boolean): void => {
      if (!toClose) {
         toggleStatusModal(value, true)
      } else {
         toggleStatusModal(value, false)
      }
   }, [toggleStatusModal])

   return [isModalOpen, error, toggleLoading, toggleError, toggleAlert]
}