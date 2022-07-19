import React from "react"

import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import axios from "axios"

import { DialogForm } from "@components/admin"
import { DataTable } from "@components/admin/DataTable"
import { DialogWindow } from "@components/admin/dialogs/DialogWindow"
import { modalInitialState } from "@constants/modalInitialState"
import { useDataTable } from "@hooks/useDataTable"
import AdminLayout from "@layouts/admin/AdminLayout"
import { isEditInputDisabled } from "@utils/isEditInputDisabled"

import type { PartnersPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const PartnersPage: NextPage<PartnersPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   const [isModalOpen, setIsModalOpen] = React.useState(modalInitialState)
   const [partnerId, setPartnerId] = React.useState("")
   const [editableRow, setEditableRow] = React.useState<{ [k: string]: string; }>({})

   const [tableColumns, tableRows] = useDataTable(data)

   const handleToggleModal = (key: string, show: boolean): void => {
      setIsModalOpen({
         ...isModalOpen,
         [key]: show
      })
   }

   const handleOpenDeleteDialog = (id: string): void => {
      setPartnerId(id)
      handleToggleModal("delete", true)
   }

   const handleOpenEditDialog = (index: number): void => {
      const editableFields = Object
         .fromEntries((tableColumns.map((_, i) => [tableColumns[i], tableRows[index][i]])))

      setEditableRow(editableFields)
      handleToggleModal("edit", true)
   }

   const handleAddEntity = (event: React.SyntheticEvent): void => {
      event.preventDefault()
      handleToggleModal("add", false)
      //   router.replace(router.asPath);
   }

   const handleEditEntity = (event: React.SyntheticEvent): void => {
      event.preventDefault()
      handleToggleModal("edit", false)
   }

   const handleDeleteEntity = (): void => {
      handleToggleModal("delete", false)
      //   router.replace(router.asPath);
   }

   return (
      <AdminLayout serverError={serverErrorMessage}>
         {isModalOpen.add &&
            <DialogForm description="Please, submit form in order to add a New Partner."
                        handleCloseDialog={(): void => handleToggleModal("add", false)}
                        handleSubmitForm={handleAddEntity}
                        isOpen={isModalOpen.add} title="Add New Partner">
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
         {isModalOpen.edit &&
            <DialogForm description="Please, submit form in order to edit necessary Partner."
                        handleCloseDialog={(): void => handleToggleModal("edit", false)}
                        handleSubmitForm={handleEditEntity}
                        isOpen={isModalOpen.edit} title="Edit Partner">
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
         {isModalOpen.delete &&
            <DialogWindow handleCloseDialog={(): void => handleToggleModal("delete", false)}
                          handleDeleteEntity={handleDeleteEntity} isOpen={isModalOpen.delete}
                          title="Are you sure you want to delete Partner?">
               {partnerId}
            </DialogWindow>}
         <Button color="info"
                 size="large"
                 sx={{
                    mt: 3,
                    mb: 2
                 }}
                 type="button"
                 variant="contained"
                 onClick={(): void => handleToggleModal("add", true)}
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