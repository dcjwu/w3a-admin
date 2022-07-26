import React from "react"

import axios from "axios"
import dynamic from "next/dynamic"

import { Loading } from "@components/admin"
import { FormDataType } from "@customTypes/admin/common"
import {
   DataTableType,
   DialogFormType,
   DialogStatusEnum, DialogStatusType,
   DialogWindowType,
   DialogWithInputsType
} from "@customTypes/admin/components"
import { RequestMethodEnum } from "@customTypes/admin/hooks"
import { AdminLayoutType } from "@customTypes/admin/layouts"
import { useAxios, useDataTable, useEditableRow, useMainDialog } from "@hooks/admin"
import { isEditInputDisabled } from "@utils/isEditInputDisabled"

import type { ProjectsPageType } from "@customTypes/admin/pages"
import type { TextFieldProps } from "@mui/material/TextField"
import type { GetServerSideProps, NextPage } from "next"

const Button = dynamic(import("@mui/material/Button"))
const Typography = dynamic(import("@mui/material/Typography"))

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })
const DialogWithInputs = dynamic<DialogWithInputsType>(() => import("@components/admin").then(module => module.DialogWithInputs))
const Input = dynamic<TextFieldProps>(() => import("@components/admin").then(module => module.Input))
const DataTable = dynamic<DataTableType>(() => import("@components/admin/DataTable").then(module => module.DataTable), { loading: () => <Loading isOpen={true} message="Table"/> })
const DialogDelete = dynamic<DialogWindowType>(() => import("@components/admin/dialogs/DialogDelete").then(module => module.DialogDelete))
const DialogForm = dynamic<DialogFormType>(() => import("@components/admin/dialogs/DialogForm").then(module => module.DialogForm))
const DialogStatus = dynamic<DialogStatusType>(() => import("@components/admin/dialogs/DialogStatus").then(module => module.DialogStatus))

const initialValuesAddProject = {
   name: "",
   description: "",
   imageUrl: "",
   keywords: ""
}

const ProjectsPage: NextPage<ProjectsPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   //TODO Refactor as one reusable component with other pages :)

   const [projectId, setProjectId] = React.useState("")

   const [tableColumns, tableRows] = useDataTable(data)
   const [editableRow, setEditableRow] = useEditableRow()
   const [isMainModalOpen, toggleMainModal] = useMainDialog()
   const [isStatusModalOpen, error, toggleLoading, toggleError, handleRequest] = useAxios()

   const handleOpenDeleteDialog = (id: string): void => {
      setProjectId(id)
      toggleMainModal("delete", true)
   }

   const handleOpenEditDialog = (index: number): void => {
      setEditableRow(tableColumns, tableRows, index)
      toggleMainModal("edit", true)
   }

   const handleAddEntity = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      await handleRequest(RequestMethodEnum.POST, "projects", toggleMainModal, formData)
   }

   const handleEditEntity = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      const {
         name,
         imageUrl,
         link
      } = formData
      event.preventDefault()
      await handleRequest(RequestMethodEnum.PATCH, `projects/${formData.id}`, toggleMainModal, {
         name,
         imageUrl,
         link
      })
   }

   const handleDeleteEntity = async (): Promise<void> => {
      await handleRequest(RequestMethodEnum.DELETE, `projects/${projectId}`, toggleMainModal)
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
                           initialState={initialValuesAddProject}>
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
               {projectId}
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

export default ProjectsPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const services = await axios.get(`${process.env.URL}/api/projects`,
         { headers: { Cookie: cookie || "" } })
      const { data } = services
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}