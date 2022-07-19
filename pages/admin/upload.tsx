import React from "react"

import { Alert, AlertTitle, ListItem } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"
import axios from "axios"
import moment from "moment"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { v4 as uuidv4 } from "uuid"

import { DialogForm } from "@components/admin"
import DialogStatus from "@components/admin/dialogs/DialogStatus"
import { awsBucketUrl } from "@constants/awsBucketUrl"
import { linkCopiedInitialState } from "@constants/linkCopiedInitialState"
import { modalInitialState } from "@constants/modalInitialState"
import { DialogStatusEnum } from "@customTypes/admin/components"
import AdminLayout from "@layouts/admin/AdminLayout"

import type { UploadPageType } from "@customTypes/admin/pages"
import type { NextPage } from "next"

const UploadPage: NextPage<UploadPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   //TODO: Refactor this thing
   //TODO: Add delete file + modal to confirm

   const router = useRouter()

   const [isModalOpen, setIsModalOpen] = React.useState(modalInitialState)
   const [isLinkCopied, setIsLinkCopied] = React.useState(linkCopiedInitialState)
   const [file, setFile] = React.useState<FileList | null>(null)
   const [loading, setLoading] = React.useState(false)
   const [error, setError] = React.useState("")
   const [success, setSuccess] = React.useState(false)

   const handleToggleModal = (key: string, show: boolean): void => {
      setIsModalOpen({
         ...isModalOpen,
         [key]: show
      })
      if (!show) {
         handleFileRemove()
         setLoading(false)
         setSuccess(false)
         setError("")
      }
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
         setLoading(true)
         const { data } = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/files/upload`, {
            name: `${uuidv4()}.webp`,
            type: file[0].type
         }, { withCredentials: true })

         const url = data.url
         await axios.put(url, file[0], { headers: { "Content-type": file[0].type } })
            .then(res => {
               setLoading(false)
               if (res.status === 200) {
                  setSuccess(true)
                  router.replace(router.asPath)
               } else {
                  setError(res.data)
               }
            })
            .catch(err => {
               console.error(err)
               setLoading(false)
               setError(err.message)
            })
      }
   }

   const handleCopyLink = (event: React.SyntheticEvent): void => {
      const target = event.target as HTMLInputElement
      navigator.clipboard.writeText(target.value)
         .then(() => {
            setIsLinkCopied({
               ...isLinkCopied,
               success: true
            })
            setTimeout(() => {
               setIsLinkCopied({
                  ...isLinkCopied,
                  success: false
               })
            }, 2500)
         })
         .catch(() => {
            setIsLinkCopied({
               ...isLinkCopied,
               error: true
            })
         })
   }

   return (
      <AdminLayout serverError={serverErrorMessage}>
         {isModalOpen.add &&
            <DialogForm description="Please, upload .webp file to AWS in order to use its link later."
                        handleCloseDialog={(): void => handleToggleModal("add", false)}
                        handleSubmitForm={handleAddFile}
                        isOpen={isModalOpen.add} title="Add New Image">
               {!file
                  ? <Button fullWidth component="label" sx={{
                     marginTop: "16px",
                     marginBottom: "8px"
                  }}
                            variant="contained">
                     Upload
                     <input hidden required accept="image/webp"
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
            </DialogForm>}
         {loading &&
            <DialogStatus handleCloseDialog={(): void => handleToggleModal("add", false)} isOpen={isModalOpen.add}
                          status={DialogStatusEnum.LOADING}/>}
         {success &&
            <DialogStatus handleCloseDialog={(): void => handleToggleModal("add", false)} isOpen={isModalOpen.add}
                          status={DialogStatusEnum.SUCCESS}/>}
         {error &&
            <DialogStatus error={error} handleCloseDialog={(): void => handleToggleModal("add", false)}
                          isOpen={isModalOpen.add} status={DialogStatusEnum.ERROR}/>}
         {isLinkCopied.success && <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            <strong>Link copied successfully</strong>
         </Alert>}
         {isLinkCopied.error && <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            <strong>Link was not copied</strong>
         </Alert>}
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
                                    Size: {(card.Size / 1024).toFixed(2)}kb
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
                                      variant="outlined">Delete</Button>
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