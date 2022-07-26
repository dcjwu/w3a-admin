import React from "react"

import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import axios from "axios"

import { DialogWithInputs, Input } from "@components/admin"
import { DataTable } from "@components/admin/DataTable"
import { DialogDelete } from "@components/admin/dialogs/DialogDelete"
import { DialogForm } from "@components/admin/dialogs/DialogForm"
import DialogStatus from "@components/admin/dialogs/DialogStatus"
import { DialogStatusEnum } from "@customTypes/admin/components"
import { RequestMethod } from "@customTypes/admin/hooks"
import { useAxios, useEditableRow, useMainDialog } from "@hooks/admin"
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

   const [partnerId, setPartnerId] = React.useState("")

   const [tableColumns, tableRows] = useDataTable(data)
   const [editableRow, setEditableRow] = useEditableRow()
   const [isMainModalOpen, toggleMainModal] = useMainDialog()
   const [isStatusModalOpen, error, toggleLoading, toggleError, handleRequest] = useAxios()

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
      await handleRequest(RequestMethod.POST, "partners", toggleMainModal, formData)
   }

   const handleEditEntity = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      const {
         name,
         imageUrl,
         link 
      } = formData
      event.preventDefault()
      await handleRequest(RequestMethod.PATCH, `partners/${formData.id}`, toggleMainModal, { name, imageUrl, link })
   }

   const handleDeleteEntity = async (): Promise<void> => {
      await handleRequest(RequestMethod.DELETE, `partners/${partnerId}`, toggleMainModal)
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