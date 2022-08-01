import React from "react"

import { Link as MuiLink } from "@mui/material"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import axios from "axios"
import moment from "moment/moment"
import dynamic from "next/dynamic"
import Link from "next/link"

import { Dropdown, Loading } from "@components/admin"
import { DialogStatusEnum } from "@customTypes/admin/components"
import { RequestMethodEnum } from "@customTypes/admin/hooks"
import { useAxios, useMainDialog } from "@hooks/admin"
import { getTicketStatusButtonColor } from "@utils/getTicketStatusButtonColor"

import type { FormDataType } from "@customTypes/admin/common"
import type { DialogFormType, DialogStatusType, DialogWithInputsType } from "@customTypes/admin/components"
import type { AdminLayoutType } from "@customTypes/admin/layouts"
import type { TicketsPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const Card = dynamic(import("@mui/material/Card"))
const CardActions = dynamic(import("@mui/material/CardActions"))
const CardContent = dynamic(import("@mui/material/CardContent"))

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })
const DialogWithInputs = dynamic<DialogWithInputsType>(() => import("@components/admin").then(module => module.DialogWithInputs))
const DialogForm = dynamic<DialogFormType>(() => import("@components/admin/dialogs/DialogForm").then(module => module.DialogForm))
const DialogStatus = dynamic<DialogStatusType>(() => import("@components/admin/dialogs/DialogStatus").then(module => module.DialogStatus))

const initialTicketStatus = { status: "" }

const TicketsPage: NextPage<TicketsPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   const [id, setId] = React.useState<string>("")
   const [currentTicketStatus, setCurrentTicketStatus] = React.useState(initialTicketStatus)

   const [isMainModalOpen, toggleMainModal] = useMainDialog()
   const [isStatusModalOpen, error, toggleLoading, toggleError, handleRequest] = useAxios()

   const handleOpenEditDialog = (id: string, status: string): void => {
      setId(id)
      setCurrentTicketStatus({
         ...currentTicketStatus,
         status: status
      })
      toggleMainModal("edit", true)
   }

   const handleEditEntity = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      await handleRequest(RequestMethodEnum.PATCH, `tickets/${id}`, toggleMainModal, { ...formData })
   }

   //TODO: Add search and filter

   return (
      <AdminLayout serverError={serverErrorMessage}>
         {isStatusModalOpen.loading &&
            <DialogStatus handleCloseDialog={(): void => toggleLoading(false)} isOpen={isStatusModalOpen.loading}
                          status={DialogStatusEnum.LOADING}/>}
         {isStatusModalOpen.error &&
            <DialogStatus error={error} handleCloseDialog={(): void => toggleError()}
                          isOpen={isStatusModalOpen.error} status={DialogStatusEnum.ERROR}/>}
         {isMainModalOpen.edit && <DialogWithInputs description="Please, submit form in order to change Ticket status"
                                                    handleCloseDialog={(): void => toggleMainModal("edit", false)}
                                                    isOpen={isMainModalOpen.edit}
                                                    title="Change Status">
            <DialogForm handleCloseDialog={(): void => toggleMainModal("edit", false)}
                        handleFormSubmit={handleEditEntity}
                        initialState={currentTicketStatus}>
               <Dropdown disabledFields={["REPLIED"]} dropdownItems={["NEW", "CLOSED", "REPLIED"]} label="Ticket Status"
                         name="status"/>
            </DialogForm>
         </DialogWithInputs>}
         {data.length > 0 ? data.map(item => (
            <Card key={item.id} sx={{
               minWidth: 275,
               marginBottom: "16px"
            }}>
               <CardContent>
                  <Typography gutterBottom color="text.secondary" sx={{ fontSize: 14 }}>
                     Date: {moment.utc(item.createdAt).local().format("DD/MM/YYYY HH:mm")}
                  </Typography>
                  <Typography gutterBottom color="text.secondary" sx={{ fontSize: 14 }}>
                     IP Address: {item.ipAddress}
                  </Typography>
                  <Typography component="div" variant="h5">
                     {item.topic}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                     {item.email}
                  </Typography>
               </CardContent>
               <CardActions>
                  <Button color={getTicketStatusButtonColor(item.status)} disabled={item.status === "REPLIED"}
                          size="large"
                          sx={{ marginRight: "8px" }}
                          variant="contained"
                          onClick={(): void => handleOpenEditDialog(item.id, item.status)}>{item.status}</Button>
                  <Link href={`tickets/${item.id}`}>
                     <MuiLink underline="none">
                        <Button size="large">View</Button>
                     </MuiLink>
                  </Link>
               </CardActions>
            </Card>
         )) : <Typography color="error" variant="subtitle2">No records found</Typography>}
      </AdminLayout>
   )
}

export default TicketsPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const tickets = await axios.get(`${process.env.URL}/api/tickets`,
         { headers: { Cookie: cookie || "" } })
      const { data } = tickets
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}