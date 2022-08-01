import React from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import axios from "axios"
import moment from "moment/moment"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { Loading } from "@components/admin"
import { DialogInfo } from "@components/admin/dialogs/DialogInfo"
import { DialogStatusEnum } from "@customTypes/admin/components"
import { RequestMethodEnum } from "@customTypes/admin/hooks"
import { useAxios, useMainDialog } from "@hooks/admin"

import type { FormDataType } from "@customTypes/admin/common"
import type { DialogFormType, DialogStatusType, DialogWithInputsType } from "@customTypes/admin/components"
import type { AdminLayoutType } from "@customTypes/admin/layouts"
import type { TicketsByIdPageType } from "@customTypes/admin/pages"
import type { PaperProps } from "@mui/material"
import type { TextFieldProps } from "@mui/material/TextField"
import type { GetServerSideProps, NextPage } from "next"

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })
const StyledPaper = dynamic<PaperProps>(() => import("@components/admin").then(module => module.StyledPaper), { loading: () => <Loading isOpen={true} message="Tickets"/> })
const DialogStatus = dynamic<DialogStatusType>(() => import("@components/admin/dialogs/DialogStatus").then(module => module.DialogStatus))
const DialogWithInputs = dynamic<DialogWithInputsType>(() => import("@components/admin").then(module => module.DialogWithInputs))
const DialogForm = dynamic<DialogFormType>(() => import("@components/admin/dialogs/DialogForm").then(module => module.DialogForm))
const Input = dynamic<TextFieldProps>(() => import("@components/admin").then(module => module.Input))

const initialTicketReplyState = {
   subject: "",
   message: ""
}

const TicketsPageById: NextPage<TicketsByIdPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   const router = useRouter()

   const [isMainModalOpen, toggleMainModal] = useMainDialog()
   const [isStatusModalOpen, error, toggleLoading, toggleError, handleRequest] = useAxios()

   const [replyForm, setReplyForm] = React.useState(initialTicketReplyState)

   const handleToggleTicketStatus = async (status: string): Promise<void> => {
      await handleRequest(RequestMethodEnum.PATCH, `tickets/${data.id}`, toggleMainModal, { status: status })
   }

   const handleOpenReplyDialog = (): void => {
      toggleMainModal("add", true)
      setReplyForm({
         ...replyForm,
         subject: `Your inquiry about ${data.topic}`,
         message: `Dear, ${data.name}...`
      })
   }

   const handleReply = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      await handleRequest(RequestMethodEnum.POST, "reply", toggleMainModal, {
         ...formData,
         ticketId: data.id,
         recipientEmail: data.email
      })
   }

   const handleShowReply = (): void => {
      toggleMainModal("info", true)
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
            <DialogWithInputs handleCloseDialog={(): void => toggleMainModal("add", false)} isOpen={isMainModalOpen.add}
                              title={`Your reply to ${data.name} about ${data.topic}`}>
               <DialogForm handleCloseDialog={(): void => toggleMainModal("add", false)}
                           handleFormSubmit={handleReply}
                           initialState={replyForm}>
                  <Input fullWidth
                         required
                         label="Subject"
                         margin="normal"
                         name="subject"
                         type="text"
                         variant="standard"
                  />
                  <Input autoFocus
                         fullWidth
                         multiline
                         required
                         label="Message"
                         margin="normal"
                         name="message"
                         rows={5}
                         type="text"
                         variant="standard"
                  />
               </DialogForm>
            </DialogWithInputs>}
         {isMainModalOpen.info &&
            <DialogInfo handleCloseDialog={(): void => toggleMainModal("info", false)} isOpen={isMainModalOpen.info}
                        title={`Reply to ${data.email}`}>
               {data.reply ? <>
                  <StyledPaper sx={{
                     my: 1,
                     mx: "auto",
                     p: 2,
                  }}
                  >
                     <Grid container spacing={2} wrap="nowrap">
                        <Grid item>
                           <Typography variant="subtitle2">Time:</Typography>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                           <Typography noWrap>{moment.utc(data.reply.createdAt).local().format("DD/MM/YYYY HH:mm")}</Typography>
                        </Grid>
                     </Grid>
                  </StyledPaper>
                  <StyledPaper sx={{
                     my: 1,
                     mx: "auto",
                     p: 2,
                  }}
                  >
                     <Grid container spacing={2} wrap="nowrap">
                        <Grid item>
                           <Typography variant="subtitle2">Email:</Typography>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                           <Typography noWrap>{data.reply.recipientEmail}</Typography>
                        </Grid>
                     </Grid>
                  </StyledPaper>
                  <StyledPaper sx={{
                     my: 1,
                     mx: "auto",
                     p: 2,
                  }}
                  >
                     <Grid container spacing={2} wrap="nowrap">
                        <Grid item>
                           <Typography variant="subtitle2">Subject:</Typography>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                           <Typography noWrap>{data.reply.subject}</Typography>
                        </Grid>
                     </Grid>
                  </StyledPaper>
                  <StyledPaper sx={{
                     my: 1,
                     mx: "auto",
                     p: 2,
                  }}
                  >
                     <Grid container spacing={2} wrap="nowrap">
                        <Grid item>
                           <Typography variant="subtitle2">Message:</Typography>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                           <Typography>{data.reply.message}</Typography>
                        </Grid>
                     </Grid>
                  </StyledPaper>
               </>
                  : <Typography color="error" variant="subtitle2">Absolutely unexpected stuff</Typography>}
            </DialogInfo>}
         <Button color="info" size="large"
                 sx={{
                    mt: 3,
                    mb: 2
                 }}
                 type="button"
                 variant="contained"
                 onClick={(): void => router.back()}
         >
            Go Back
         </Button>
         <Box sx={{
            flexGrow: 1,
            overflow: "hidden",
            px: 3
         }}>
            <StyledPaper sx={{
               my: 1,
               mx: "auto",
               p: 2,
            }}
            >
               <Grid container spacing={2} wrap="nowrap">
                  <Grid item>
                     <Typography variant="subtitle2">Ticket Status:</Typography>
                  </Grid>
                  <Grid item xs zeroMinWidth>
                     <Typography noWrap>{data.status}</Typography>
                  </Grid>
               </Grid>
            </StyledPaper>
            <StyledPaper sx={{
               my: 1,
               mx: "auto",
               p: 2,
            }}
            >
               <Grid container spacing={2} wrap="nowrap">
                  <Grid item>
                     <Typography variant="subtitle2">IP Address:</Typography>
                  </Grid>
                  <Grid item xs zeroMinWidth>
                     <Typography noWrap>{data.ipAddress}</Typography>
                  </Grid>
               </Grid>
            </StyledPaper>
            <StyledPaper sx={{
               my: 1,
               mx: "auto",
               p: 2,
            }}
            >
               <Grid container spacing={2} wrap="nowrap">
                  <Grid item>
                     <Typography variant="subtitle2">Time:</Typography>
                  </Grid>
                  <Grid item xs zeroMinWidth>
                     <Typography noWrap>{moment.utc(data.createdAt).local().format("DD/MM/YYYY HH:mm")}</Typography>
                  </Grid>
               </Grid>
            </StyledPaper>
            <StyledPaper sx={{
               my: 1,
               mx: "auto",
               p: 2,
            }}
            >
               <Grid container spacing={2} wrap="nowrap">
                  <Grid item>
                     <Typography variant="subtitle2">Email:</Typography>
                  </Grid>
                  <Grid item xs>
                     <Typography noWrap>{data.email}</Typography>
                  </Grid>
               </Grid>
            </StyledPaper>
            <StyledPaper sx={{
               my: 1,
               mx: "auto",
               p: 2,
            }}
            >
               <Grid container spacing={2} wrap="nowrap">
                  <Grid item>
                     <Typography variant="subtitle2">Name:</Typography>
                  </Grid>
                  <Grid item xs>
                     <Typography noWrap>{data.name}</Typography>
                  </Grid>
               </Grid>
            </StyledPaper>
            <StyledPaper sx={{
               my: 1,
               mx: "auto",
               p: 2,
            }}
            >
               <Grid container spacing={2} wrap="nowrap">
                  <Grid item>
                     <Typography variant="subtitle2">Company:</Typography>
                  </Grid>
                  <Grid item xs>
                     <Typography>{data.companyName}</Typography>
                  </Grid>
               </Grid>
            </StyledPaper>
            <StyledPaper sx={{
               my: 1,
               mx: "auto",
               p: 2,
            }}
            >
               <Grid container spacing={2} wrap="nowrap">
                  <Grid item>
                     <Typography variant="subtitle2">Topic:</Typography>
                  </Grid>
                  <Grid item xs>
                     <Typography>{data.topic}</Typography>
                  </Grid>
               </Grid>
            </StyledPaper>
            <StyledPaper sx={{
               my: 1,
               mx: "auto",
               p: 2,
            }}
            >
               <Grid container spacing={2} wrap="nowrap">
                  <Grid item>
                     <Typography variant="subtitle2">Message:</Typography>
                  </Grid>
                  <Grid item xs>
                     <Typography>{data.text}</Typography>
                  </Grid>
               </Grid>
            </StyledPaper>
         </Box>
         <Box sx={{
            mx: "auto",
            width: "40vw"
         }}>
            {data.status === "NEW" && <>
               <Button fullWidth color="success" size="large"
                       sx={{ mt: 3, }}
                       type="button"
                       variant="contained"
                       onClick={handleOpenReplyDialog}
               >
                  Reply
               </Button>
               <Button fullWidth color="error" size="large"
                       sx={{ mt: 3, }}
                       type="button"
                       variant="contained"
                       onClick={(): Promise<void> => handleToggleTicketStatus("CLOSED")}
               >
                  Close Ticket
               </Button>
            </>}
            {data.status === "REPLIED" && <>
               <Button fullWidth color="warning" size="large"
                       sx={{ mt: 3, }}
                       type="button"
                       variant="contained"
                       onClick={handleShowReply}
               >
                  View reply
               </Button>
            </>}
            {data.status === "CLOSED" && <>
               <Button fullWidth color="success" size="large"
                       sx={{ mt: 3, }}
                       type="button"
                       variant="contained"
                       onClick={(): Promise<void> => handleToggleTicketStatus("NEW")}
               >
                  Reopen
               </Button>
            </>}
         </Box>
      </AdminLayout>
   )
}

export default TicketsPageById

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers
   const { query } = context

   try {
      const tickets = await axios.get(`${process.env.URL}/api/tickets/${query.id}`,
         { headers: { Cookie: cookie || "" } })
      const { data } = tickets
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}