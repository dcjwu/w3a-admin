import axios from "axios"
import { useRouter } from "next/router"

import { RequestMethodEnum } from "@customTypes/admin/hooks"
import { useStatusDialog } from "@hooks/admin/useStatusDialog"

import type { FormDataType } from "@customTypes/admin/common"
import type { DialogToggleType, UseAxiosType } from "@customTypes/admin/hooks"

const methodMapping = new Map([
   [RequestMethodEnum.POST, ["201", "add"]],
   [RequestMethodEnum.PATCH, ["200", "edit"]],
   [RequestMethodEnum.DELETE, ["200", "delete"]],
])

export const useAxios = (): UseAxiosType => {
   const router = useRouter()
   const [isStatusModalOpen, error, toggleLoading, toggleError] = useStatusDialog()

   const handleAxiosRequest = async (method: RequestMethodEnum, endpoint: string, modalToggle: DialogToggleType, formData?: FormDataType): Promise<void> => {
      toggleLoading(true)

      const currentMethod: Array<string> | undefined = methodMapping.has(method) ? methodMapping.get(method) : undefined

      if (currentMethod && currentMethod.length) {
         axios({
            method: method,
            url: `${process.env.NEXT_PUBLIC_URL}/api/${endpoint}`,
            data: formData,
            withCredentials: true
         })
            .then(res => {
               toggleLoading(false)
               if (res.status === +currentMethod[0]) {
                  router.replace(router.asPath)
                  modalToggle(currentMethod[1], false)
               } else {
                  console.warn(res.data)
                  toggleError("Something went wrong")
               }
            })
            .catch(err => {
               toggleLoading(false)
               const errorData = err.response.data
               if (Array.isArray(errorData)) {
                  errorData.forEach((item: { message: string | undefined }) => {
                     toggleError(item.message)
                  })
               } else {
                  toggleError(errorData.message)
               }
            })
      }
   }

   return [isStatusModalOpen, error, toggleLoading, toggleError, handleAxiosRequest]
}