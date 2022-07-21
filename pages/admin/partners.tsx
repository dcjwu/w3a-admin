import React from "react"

import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import axios from "axios"

import { DialogForm } from "@components/admin"
import { DataTable } from "@components/admin/DataTable"
import { DialogDelete } from "@components/admin/dialogs/DialogDelete"
import { useEditableRow, useMainDialog } from "@hooks/admin"
import { useDataTable } from "@hooks/admin/useDataTable"
import AdminLayout from "@layouts/admin/AdminLayout"
import { isEditInputDisabled } from "@utils/isEditInputDisabled"

import type { PartnersPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const PartnersPage: NextPage<PartnersPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   const [partnerId, setPartnerId] = React.useState("")

   const [isMainModalOpen, toggleMainModal] = useMainDialog()
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

   const handleAddEntity = (event: React.SyntheticEvent): void => {
      event.preventDefault()
      toggleMainModal("add", false)
      //   router.replace(router.asPath);
   }

   const handleEditEntity = (event: React.SyntheticEvent): void => {
      event.preventDefault()
      toggleMainModal("edit", false)
      //   router.replace(router.asPath);
   }

   const handleDeleteEntity = (): void => {
      toggleMainModal("delete", false)
      //   router.replace(router.asPath);
   }

   return (
      <AdminLayout serverError={serverErrorMessage}>
         {isMainModalOpen.add &&
            <DialogForm description="Please, submit form in order to add a New Partner."
                        handleCloseDialog={(): void => toggleMainModal("add", false)}
                        handleSubmitForm={handleAddEntity}
                        isButtonDisabled={true} isOpen={isMainModalOpen.add} title="Add New Partner">
               <TextField autoFocus
                          fullWidth
                          required
                          id="name"
                          label="Partner's name"
                          margin="normal"
                          type="text"
                          variant="standard"
               />
               <TextField fullWidth
                          required
                          id="partnersWebsite"
                          label="Partner's website URL"
                          margin="normal"
                          type="text"
                          variant="standard"
               />
               <TextField fullWidth
                          required
                          id="partnersLogo"
                          label="Partner's Logo URL"
                          margin="normal"
                          type="text"
                          variant="standard"
               />
            </DialogForm>}
         {isMainModalOpen.edit &&
            <DialogForm description="Please, submit form in order to edit necessary Partner."
                        handleCloseDialog={(): void => toggleMainModal("edit", false)}
                        handleSubmitForm={handleEditEntity}
                        isButtonDisabled={true}
                        isOpen={isMainModalOpen.edit} title="Edit Partner">
               {tableColumns.map(item => (
                  <TextField key={item} autoFocus fullWidth
                             disabled={isEditInputDisabled(item)}
                             id={item}
                             label={item}
                             margin="normal"
                             type="text"
                             value={editableRow[item]}
                             variant="filled"
                  />
               ))}
            </DialogForm>}
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
         <DataTable handleOpenDeleteDialog={handleOpenDeleteDialog} handleOpenEditDialog={handleOpenEditDialog}
                    tableColumns={tableColumns}
                    tableRows={tableRows}/>
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