import React from "react"

import Button from "@mui/material/Button"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"

import { DialogWithInputs, Input, Loading } from "@components/admin"
import { DialogForm } from "@components/admin/dialogs/DialogForm"
import { DialogStatus } from "@components/admin/dialogs/DialogStatus"
import { DialogStatusEnum } from "@customTypes/admin/components"
import { RequestMethodEnum } from "@customTypes/admin/hooks"
import { useAxios, useMainDialog } from "@hooks/admin"

import type { FormDataType } from "@customTypes/admin/common"
import type { AdminLayoutType } from "@customTypes/admin/layouts"
import type { NextPage } from "next"

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })

const initialValuesChangePassword = {
   oldPassword: "",
   newPassword: "",
   repeatNewPassword: ""
}

const ProfilePage: NextPage = (): JSX.Element => {

   const { data } = useSession()
   const [isMainModalOpen, toggleMainModal] = useMainDialog()
   const [isStatusModalOpen, error, toggleLoading, toggleError, handleRequest] = useAxios()

   const validatePassword = (passwords: { [k: string]: string }): boolean => {
      const {
         oldPassword,
         newPassword,
         repeatNewPassword
      } = passwords
      if (newPassword.trim() !== repeatNewPassword.trim()) {
         toggleError("Passwords do not match")
         return false
      }
      if (oldPassword.trim() === newPassword.trim()) {
         toggleError("Passwords cannot be the same")
         return false
      }
      return true
   }

   const handleChangePassword = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      const validation = validatePassword(formData)
      if (validation) {
         if (data) {
            const { oldPassword, newPassword } = formData
            await handleRequest(RequestMethodEnum.PATCH, "users/password", toggleMainModal, {
               id: data.user.id,
               oldPassword: oldPassword,
               newPassword: newPassword
            })

         } else {
            toggleError("Something went wrong")
         }
      }
   }

   return (
      <AdminLayout>
         {isStatusModalOpen.loading &&
            <DialogStatus handleCloseDialog={(): void => toggleLoading(false)} isOpen={isStatusModalOpen.loading}
                          status={DialogStatusEnum.LOADING}/>}
         {isStatusModalOpen.error &&
            <DialogStatus error={error} handleCloseDialog={(): void => toggleError()}
                          isOpen={isStatusModalOpen.error} status={DialogStatusEnum.ERROR}/>}
         {isMainModalOpen.edit &&
            <DialogWithInputs description="Please, submit form in order to change password"
                              handleCloseDialog={(): void => toggleMainModal("edit", false)}
                              isOpen={isMainModalOpen.edit}
                              title="Change password">
               <DialogForm handleCloseDialog={(): void => toggleMainModal("edit", false)}
                           handleFormSubmit={handleChangePassword}
                           initialState={initialValuesChangePassword}>
                  <Input autoFocus
                         fullWidth
                         required
                         label="Old password"
                         margin="normal"
                         name="oldPassword"
                         type="text"
                         variant="standard"
                  />
                  <Input fullWidth
                         required
                         label="New password"
                         margin="normal"
                         name="newPassword"
                         type="text"
                         variant="standard"
                  />
                  <Input fullWidth
                         required
                         label="Repeat new password"
                         margin="normal"
                         name="repeatNewPassword"
                         type="text"
                         variant="standard"
                  />
               </DialogForm>
            </DialogWithInputs>}
         <Button color="info"
                 size="large"
                 sx={{
                    mt: 3,
                    mb: 2
                 }}
                 type="button"
                 variant="contained"
                 onClick={(): void => toggleMainModal("edit", true)}
         >
            Change password
         </Button>
      </AdminLayout>
   )
}

export default ProfilePage