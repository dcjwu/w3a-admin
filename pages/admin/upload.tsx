import React, { useEffect } from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CardMedia from "@mui/material/CardMedia"
import List from "@mui/material/List"
import axios from "axios"
import moment from "moment"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { v4 as uuidv4 } from "uuid"

import { Loading } from "@components/admin"
import { awsBucketUrl } from "@constants/admin/awsBucketUrl"
import { DialogStatusEnum } from "@customTypes/admin/components"
import { useStatusDialog } from "@hooks/admin"
import { useMainDialog } from "@hooks/admin/useMainDialog"

import type { DialogStatusType, DialogWindowType, DialogWithInputsType } from "@customTypes/admin/components"
import type { AdminLayoutType } from "@customTypes/admin/layouts"
import type { UploadPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const Alert = dynamic(import("@mui/material/Alert"))
const AlertTitle = dynamic(import("@mui/material/AlertTitle"))
const ListItem = dynamic(import("@mui/material/ListItem"))
const Card = dynamic(import("@mui/material/Card"))
const CardActions = dynamic(import("@mui/material/CardActions"))
const CardContent = dynamic(import("@mui/material/CardContent"))
const DialogActions = dynamic(import("@mui/material/DialogActions"))
const DialogContent = dynamic(import("@mui/material/DialogContent"))
const Grid = dynamic(import("@mui/material/Grid"), { loading: () => <Loading isOpen={true} message="Images"/> })
const Typography = dynamic(import("@mui/material/Typography"))

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })
const DialogWithInputs = dynamic<DialogWithInputsType>(() => import("@components/admin").then(module => module.DialogWithInputs))
const DialogDelete = dynamic<DialogWindowType>(() => import("@components/admin/dialogs/DialogDelete").then(module => module.DialogDelete))
const DialogStatus = dynamic<DialogStatusType>(() => import("@components/admin/dialogs/DialogStatus").then(module => module.DialogStatus))

const UploadPage: NextPage<UploadPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   const router = useRouter()

   const [isMainModalOpen, toggleMainModal] = useMainDialog()
   const [isStatusModalOpen, error, toggleLoading, toggleError, toggleAlert] = useStatusDialog()
   const [file, setFile] = React.useState<FileList | null>(null)
   const [imageKey, setImageKey] = React.useState("")

   const handleOpenDeleteDialog = (key: string): void => {
      toggleMainModal("delete", true)
      setImageKey(key)
   }

   const handleFileUpload = (event: React.SyntheticEvent): void => {
      const target = event.target as HTMLInputElement
      setFile(target.files)
   }

   const handleFileRemove = (): void => {
      setFile(null)
   }

   const handleAddFile = async (event: React.SyntheticEvent): Promise<void> => {
      event.preventDefault()

      if (file && file.length) {
         toggleLoading(true)
         const extension = file[0].name.split(".").pop()
         const { data } = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/files/upload`, {
            name: `${uuidv4()}.${extension}`,
            type: file[0].type
         }, { withCredentials: true })

         const url = data.url
         await axios.put(url, file[0], { headers: { "Content-type": file[0].type } })
            .then(res => {
               toggleLoading(false)
               if (res.status === 200) {
                  router.replace(router.asPath)
                  toggleMainModal("add", false)
               } else {
                  console.warn(res.data)
                  toggleError("Something went wrong")
               }
            })
            .catch(err => {
               toggleLoading(false)
               toggleError(err.message)
            })
      }
   }

   const handleRemoveFile = async (): Promise<void> => {
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/files/delete`, { key: imageKey }, { withCredentials: true })
         .then(res => {
            if (res.status === 200) {
               router.replace(router.asPath)
               toggleMainModal("delete", false)
            } else {
               console.warn(res.data)
               toggleError("Something went wrong")
            }
         })
         .catch(err => {
            toggleError(err.message)
         })
   }

   const handleCopyLink = (event: React.SyntheticEvent): void => {
      const target = event.target as HTMLInputElement
      navigator.clipboard.writeText(target.value)
         .then(() => {
            toggleAlert("alertSuccess")
            setTimeout(() => {
               toggleAlert("alertSuccess", true)
            }, 2500)
         })
         .catch(() => {
            toggleAlert("alertError")
         })
   }

   useEffect(() => {
      handleFileRemove()
   }, [isMainModalOpen.add])

   return (
      <AdminLayout serverError={serverErrorMessage}>
         {isStatusModalOpen.loading &&
            <DialogStatus handleCloseDialog={(): void => toggleLoading(false)} isOpen={isStatusModalOpen.loading}
                          status={DialogStatusEnum.LOADING}/>}
         {isStatusModalOpen.error &&
            <DialogStatus error={error} handleCloseDialog={(): void => toggleError()}
                          isOpen={isStatusModalOpen.error} status={DialogStatusEnum.ERROR}/>}
         {isMainModalOpen.add &&
            <DialogWithInputs description="Please, upload .webp file to AWS in order to use its link later."
                              handleCloseDialog={(): void => toggleMainModal("add", false)}
                              isOpen={isMainModalOpen.add} title="Add New Image">
               <DialogContent sx={{ py: 0 }}>
                  <Box component="form"
                       onSubmit={handleAddFile}>
                     {!file
                        ? <Button fullWidth component="label" sx={{
                           marginTop: "16px",
                           marginBottom: "8px"
                        }}
                                  variant="contained">
                           Upload
                           <input hidden required accept="image/webp, image/svg+xml"
                                  type="file" onChange={handleFileUpload}/>
                        </Button>
                        : <Box sx={{
                           marginTop: "16px",
                           marginBottom: "8px"
                        }}>
                           <Typography sx={{
                              margin: "16px",
                              marginBottom: "8px",
                              textAlign: "center"
                           }} variant="subtitle2">
                              [{file[0].name}, {(file[0].size / 1024).toFixed(2)}kb]
                           </Typography>
                           <Button fullWidth color="error" component="label"
                                   variant="contained"
                                   onClick={handleFileRemove}>
                              Delete
                           </Button>
                        </Box>}
                     <DialogActions>
                        <Button type="button" onClick={(): void => toggleMainModal("add", false)}>Cancel</Button>
                        <Button disabled={!file} type="submit">
                           Submit</Button>
                     </DialogActions>
                  </Box>
               </DialogContent>
            </DialogWithInputs>}
         {isMainModalOpen.delete &&
            <DialogDelete handleCloseDialog={(): void => toggleMainModal("delete", false)}
                          handleDeleteEntity={handleRemoveFile}
                          isOpen={isMainModalOpen.delete}
                          title="Are you sure you want to delete this image?">
               {null}
            </DialogDelete>}
         {isStatusModalOpen.alertSuccess && <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            <strong>Link copied!</strong>
         </Alert>}
         {isStatusModalOpen.alertError && <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            <strong>Link was not copied!</strong>
         </Alert>}
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
            Upload File
         </Button>
         {data && <Grid container spacing={4}>
            {data
               .sort((a, b) => Date.parse(b.LastModified) - Date.parse(a.LastModified))
               .map((card) => {
                  return (
                     <Grid key={card.Key} item lg={2}
                           md={3} sm={6} xs={12}>
                        <Card sx={{
                           height: "100%",
                           display: "flex",
                           flexDirection: "column"
                        }}
                        >
                           <CardMedia alt={card.Key} component="img"
                                      image={`${awsBucketUrl}/${card.Key}`}
                           />
                           <CardContent sx={{ flexGrow: 1 }}>
                              <List>
                                 <ListItem>
                                    Size: {(+card.Size / 1024).toFixed(2)}kb
                                 </ListItem>
                                 <ListItem>
                                    Added: {moment(card.LastModified).format("DD/MM/YYYY")}
                                 </ListItem>
                              </List>
                           </CardContent>
                           <CardActions>
                              <Button fullWidth color="info" component="label"
                                      variant="outlined">
                                 Copy
                                 <input hidden readOnly
                                        type="text"
                                        value={`${awsBucketUrl}/${card.Key}`}
                                        onClick={handleCopyLink}/>
                              </Button>
                              <Button fullWidth color="error" component="label"
                                      variant="outlined"
                                      onClick={(): void => handleOpenDeleteDialog(card.Key)}>Delete</Button>
                           </CardActions>
                        </Card>
                     </Grid>
                  )
               })}
         </Grid>}
      </AdminLayout>
   )
}

export default UploadPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const files = await axios.get(`${process.env.URL}/api/files/list`,
         { headers: { Cookie: cookie || "" } })
      const { data } = files
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}