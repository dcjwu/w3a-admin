import React from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CardMedia from "@mui/material/CardMedia"
import axios from "axios"
import moment from "moment"
import { unstable_getServerSession } from "next-auth"
import dynamic from "next/dynamic"

import { authOptions } from "@api/auth/[...nextauth]"
import { Input, Loading } from "@components/admin"
import { fallBackImageUrl } from "@constants/admin"
import { DialogFormType, DialogStatusEnum } from "@customTypes/admin/components"
import { RequestMethodEnum } from "@customTypes/admin/hooks"
import { useAxios, useMainDialog } from "@hooks/admin"

import type { FormDataType } from "@customTypes/admin/common"
import type { DialogStatusType, DialogWithInputsType } from "@customTypes/admin/components"
import type { AdminLayoutType } from "@customTypes/admin/layouts"
import type { UserPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const Card = dynamic(import("@mui/material/Card"))
const CardActions = dynamic(import("@mui/material/CardActions"))
const CardContent = dynamic(import("@mui/material/CardContent"))
const Typography = dynamic(import("@mui/material/Typography"))

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })
const DialogWithInputs = dynamic<DialogWithInputsType>(() => import("@components/admin").then(module => module.DialogWithInputs))
const DialogStatus = dynamic<DialogStatusType>(() => import("@components/admin").then(module => module.DialogStatus))
const DialogForm = dynamic<DialogFormType>(() => import("@components/admin").then(module => module.DialogForm))

const initialValuesChangePassword = {
   oldPassword: "",
   newPassword: "",
   repeatNewPassword: ""
}

const ProfilePage: NextPage<UserPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

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
            const {
               oldPassword,
               newPassword
            } = formData
            await handleRequest(RequestMethodEnum.PATCH, "users/password", toggleMainModal, {
               id: data.id,
               oldPassword: oldPassword,
               newPassword: newPassword
            })

         } else {
            toggleError("Something went wrong")
         }
      }
   }

   return (
      <AdminLayout serverError={serverErrorMessage}>
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
         {data && <Box>
            <Card sx={{ maxWidth: 345 }}>
               <CardMedia alt={data.name ?? "user"}
                          component="img"
                          image={!data.imageUrl ? fallBackImageUrl : data.imageUrl}
               />
               <CardContent>
                  <Typography><strong>ID:</strong> {data.id}</Typography>
                  <Typography><strong>Name:</strong> {data.name}</Typography>
                  <Typography><strong>Email:</strong> {data.email}</Typography>
                  <Typography><strong>Created at:</strong>
                     &nbsp;{moment.utc(data.createdAt).local().format("DD/MM/YYYY HH:mm")}</Typography>
                  <Typography><strong>Updated at:</strong>
                     &nbsp;{moment.utc(data.updatedAt).local().format("DD/MM/YYYY HH:mm")}</Typography>
               </CardContent>
               <CardActions>
                  <Button fullWidth
                          color="info"
                          size="medium"
                          sx={{
                             mt: 3,
                             mb: 2
                          }}
                          type="button"
                          variant="outlined"
                          onClick={(): void => toggleMainModal("edit", true)}
                  >
                     Change password
                  </Button>
               </CardActions>
            </Card>
         </Box>}
      </AdminLayout>
   )
}

export default ProfilePage

export const getServerSideProps: GetServerSideProps = async ({
   req,
   res
}) => {
   const session = await unstable_getServerSession(req, res, authOptions)

   const { cookie } = req.headers

   if (session) {
      try {
         const services = await axios.get(`${process.env.URL}/api/users/${session.user.id}`,
            { headers: { Cookie: cookie || "" } })
         const { data } = services
         return { props: { data } }
      } catch (err) {
         return { props: { serverErrorMessage: err.response.data.message } }
      }

   } else {
      return { props: { serverErrorMessage: "Session error" } }
   }
}