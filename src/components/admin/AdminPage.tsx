import React from "react"

import dynamic from "next/dynamic"

import { Loading } from "@components/admin/Loading"
import { DialogStatusEnum } from "@customTypes/admin/components"
import { RequestMethodEnum } from "@customTypes/admin/hooks"
import { useAxios, useDataTable, useEditableRow, useMainDialog } from "@hooks/admin"
import { filterRequiredFields } from "@utils/filterRequiredFields"
import { isEditInputDisabled } from "@utils/isEditInputDisabled"

import type { FormDataType } from "@customTypes/admin/common"
import type {
   AdminPageComponentType,
   DataTableType,
   DialogFormType,
   DialogStatusType,
   DialogConfirmType,
   DialogWithInputsType
} from "@customTypes/admin/components"
import type { AdminLayoutType } from "@customTypes/admin/layouts"
import type { TextFieldProps } from "@mui/material/TextField"

const Button = dynamic(import("@mui/material/Button"))
const Typography = dynamic(import("@mui/material/Typography"))

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })
const DialogWithInputs = dynamic<DialogWithInputsType>(() => import("@components/admin").then(module => module.DialogWithInputs))
const Input = dynamic<TextFieldProps>(() => import("@components/admin").then(module => module.Input))
const DataTable = dynamic<DataTableType>(() => import("@components/admin/DataTable").then(module => module.DataTable), { loading: () => <Loading isOpen={true} message="Table"/> })
const DialogConfirm = dynamic<DialogConfirmType>(() => import("@components/admin/dialogs/DialogConfirm").then(module => module.DialogConfirm))
const DialogForm = dynamic<DialogFormType>(() => import("@components/admin/dialogs/DialogForm").then(module => module.DialogForm))
const DialogStatus = dynamic<DialogStatusType>(() => import("@components/admin/dialogs/DialogStatus").then(module => module.DialogStatus))

export const AdminPage: React.FC<AdminPageComponentType> = ({
   data,
   serverErrorMessage,
   initialValues,
   endpoint,
   name,
   editableFields,
   children
}): JSX.Element => {

   const [id, setId] = React.useState<string>("")

   const [tableColumns, tableRows] = useDataTable(data)
   const [editableRow, setEditableRow] = useEditableRow()
   const [isMainModalOpen, toggleMainModal] = useMainDialog()
   const [isStatusModalOpen, error, toggleLoading, toggleError, handleRequest] = useAxios()

   const handleOpenDeleteDialog = (id: string): void => {
      setId(id)
      toggleMainModal("confirm", true)
   }

   const handleOpenEditDialog = (index: number): void => {
      setEditableRow(tableColumns, tableRows, index)
      toggleMainModal("edit", true)
   }

   const handleAddEntity = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      await handleRequest(RequestMethodEnum.POST, endpoint, toggleMainModal, formData)
   }

   const handleEditEntity = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      const requiredFields = filterRequiredFields(editableFields, formData)
      await handleRequest(RequestMethodEnum.PATCH, `${endpoint}/${formData.id}`, toggleMainModal, { ...requiredFields })
   }

   const handleDeleteEntity = async (): Promise<void> => {
      await handleRequest(RequestMethodEnum.DELETE, `${endpoint}/${id}`, toggleMainModal)
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
            <DialogWithInputs description={`Please, submit form in order to add a New ${name}.`}
                              handleCloseDialog={(): void => toggleMainModal("add", false)} isOpen={isMainModalOpen.add}
                              title={`Add New ${name}`}>
               <DialogForm handleCloseDialog={(): void => toggleMainModal("add", false)}
                           handleFormSubmit={handleAddEntity}
                           initialState={initialValues}>
                  {children}
               </DialogForm>
            </DialogWithInputs>}
         {isMainModalOpen.edit &&
            <DialogWithInputs description="Please, submit form in order to edit necessary fields"
                              handleCloseDialog={(): void => toggleMainModal("edit", false)}
                              isOpen={isMainModalOpen.edit}
                              title={`Edit ${name}`}>
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
         {isMainModalOpen.confirm &&
            <DialogConfirm handleCloseDialog={(): void => toggleMainModal("confirm", false)}
                          handleDeleteEntity={handleDeleteEntity} isOpen={isMainModalOpen.confirm}
                          title={`Are you sure you want to delete ${name}?`}>
               {id}
            </DialogConfirm>}
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
            {`Add new ${name}`}
         </Button>
         {data.length
            ? <DataTable handleOpenDeleteDialog={handleOpenDeleteDialog} handleOpenEditDialog={handleOpenEditDialog}
                         tableColumns={tableColumns}
                         tableRows={tableRows}/>
            : <Typography color="error" variant="subtitle2">No records found</Typography>}
      </AdminLayout>
   )
}