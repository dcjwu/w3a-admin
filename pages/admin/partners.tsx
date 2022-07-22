import React from "react"

import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import axios from "axios"
import { useRouter } from "next/router"

import { DialogWithInputs, Input } from "@components/admin"
import { DataTable } from "@components/admin/DataTable"
import { DialogDelete } from "@components/admin/dialogs/DialogDelete"
import { DialogForm } from "@components/admin/dialogs/DialogForm"
import DialogStatus from "@components/admin/dialogs/DialogStatus"
import { DialogStatusEnum } from "@customTypes/admin/components"
import { useEditableRow, useMainDialog, useStatusDialog } from "@hooks/admin"
import { useDataTable } from "@hooks/admin/useDataTable"
import AdminLayout from "@layouts/admin/AdminLayout"
import { isEditInputDisabled } from "@utils/isEditInputDisabled"

import type { FormDataType } from "@customTypes/admin/common"
import type { PartnersPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const initialValuesAddPartner = {
   name: "",
   link: "",
   imageUrl: ""
}

const PartnersPage: NextPage<PartnersPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   const router = useRouter()

   const [partnerId, setPartnerId] = React.useState("")

   const [isMainModalOpen, toggleMainModal] = useMainDialog()
   const [isStatusModalOpen, error, toggleLoading, toggleError] = useStatusDialog()
   const [tableColumns, tableRows] = useDataTable(data)
   const [editableRow, setEditableRow] = useEditableRow()

   const handleOpenDeleteDialog = (id: string): void => {
      setPartnerId(id)
      toggleMainModal("delete", true)
   }

   const handleOpenEditDialog = (index: number): void => {
      setEditableRow(tableColumns, tableRows, index)
      toggleMainModal("edit", true)
   }

   const handleAddEntity = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      toggleLoading(true)
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/partners`, formData, { withCredentials: true })
         .then(res => {
            toggleLoading(false)
            if (res.status === 201) {
               router.replace(router.asPath)
               toggleMainModal("add", false)
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

   const handleEditEntity = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      const {
         name,
         imageUrl,
         link
      } = formData
      event.preventDefault()
      toggleLoading(true)
      await axios.patch(`${process.env.NEXT_PUBLIC_URL}/api/partners/${formData.id}`, {
         name,
         imageUrl,
         link
      }, { withCredentials: true })
         .then(res => {
            toggleLoading(false)
            if (res.status === 200) {
               router.replace(router.asPath)
               toggleMainModal("edit", false)
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

   const handleDeleteEntity = async (): Promise<void> => {
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/partners/${partnerId}`, { withCredentials: true })
         .then(res => {
            toggleLoading(false)
            if (res.status === 200) {
               router.replace(router.asPath)
               toggleMainModal("delete", false)
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

   return (
      <AdminLayout serverError={serverErrorMessage}>
         {isStatusModalOpen.loading &&
            <DialogStatus handleCloseDialog={(): void => toggleLoading(false)} isOpen={isStatusModalOpen.loading}
                          status={DialogStatusEnum.LOADING}/>}
         {isStatusModalOpen.error &&
            <DialogStatus error={error} handleCloseDialog={(): void => toggleError()}
                          isOpen={isStatusModalOpen.error} status={DialogStatusEnum.ERROR}/>}
         {isMainModalOpen.add &&
            <DialogWithInputs description="Please, submit form in order to add a New Partner."
                              handleCloseDialog={(): void => toggleMainModal("add", false)} isOpen={isMainModalOpen.add}
                              title="Add New Partner">
               <DialogForm handleCloseDialog={(): void => toggleMainModal("add", false)}
                           handleFormSubmit={handleAddEntity}
                           initialState={initialValuesAddPartner}>
                  <Input autoFocus
                         fullWidth
                         required
                         label="Partner's name"
                         margin="normal"
                         name="name"
                         type="text"
                         variant="standard"
                  />
                  <Input fullWidth
                         required
                         label="Partner's website URL"
                         margin="normal"
                         name="link"
                         type="text"
                         variant="standard"
                  />
                  <Input fullWidth
                         required
                         label="Partner's Logo URL"
                         margin="normal"
                         name="imageUrl"
                         type="text"
                         variant="standard"
                  />
               </DialogForm>
            </DialogWithInputs>}
         {isMainModalOpen.edit &&
            <DialogWithInputs description="Please, submit form in order to edit necessary Partner."
                              handleCloseDialog={(): void => toggleMainModal("edit", false)}
                              isOpen={isMainModalOpen.edit}
                              title="Edit Partner">
               <DialogForm handleCloseDialog={(): void => toggleMainModal("edit", false)}
                           handleFormSubmit={handleEditEntity}
                           initialState={editableRow}>
                  {tableColumns.map(item => (
                     <Input key={item} autoFocus fullWidth
                            disabled={isEditInputDisabled(item)}
                            id={item}
                            label={item}
                            margin="normal"
                            name={item}
                            type="text"
                            variant="filled"
                     />
                  ))}
               </DialogForm>
            </DialogWithInputs>}
         {isMainModalOpen.delete &&
            <DialogDelete handleCloseDialog={(): void => toggleMainModal("delete", false)}
                          handleDeleteEntity={handleDeleteEntity} isOpen={isMainModalOpen.delete}
                          title="Are you sure you want to delete Partner?">
               {partnerId}
            </DialogDelete>}
         <Button color="info"
                 size="large"
                 sx={{
                    mt: 3,
                    mb: 2
                 }}
                 type="button"
                 variant="contained"
                 onClick={(): void => toggleMainModal("add", true)}
         >
            Add new Partner
         </Button>
         {data.length
            ? <DataTable handleOpenDeleteDialog={handleOpenDeleteDialog} handleOpenEditDialog={handleOpenEditDialog}
                         tableColumns={tableColumns}
                         tableRows={tableRows}/>
            : <Typography color="error" variant="subtitle2">No records found</Typography>}
      </AdminLayout>
   )
}

export default PartnersPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const services = await axios.get(`${process.env.URL}/api/partners`,
         { headers: { Cookie: cookie || "" } })
      const { data } = services
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}