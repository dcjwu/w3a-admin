import React from "react"

import Box from "@mui/material/Box/"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import axios from "axios"
import moment from "moment"
import dynamic from "next/dynamic"

import { DialogForm, DialogStatus, DialogWithInputs, Input, Item, Loading } from "@components/admin"
import { DialogStatusEnum } from "@customTypes/admin/components"
import { RequestMethodEnum } from "@customTypes/admin/hooks"
import { useAxios, useMainDialog } from "@hooks/admin"
import { isEditInputDisabled } from "@utils/isEditInputDisabled"

import type { FormDataType } from "@customTypes/admin/common"
import type { AdminLayoutType } from "@customTypes/admin/layouts"
import type { AdminPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const Typography = dynamic(import("@mui/material/Typography"))

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })

const Settings: NextPage<AdminPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   const [isMainModalOpen, toggleMainModal] = useMainDialog()
   const [isStatusModalOpen, error, toggleLoading, toggleError, handleRequest] = useAxios()

   const [activeIndex, setActiveIndex] = React.useState<number>(-1)

   const handleRedeployApp = (): void => {
      console.warn("Redeploy")
   }

   const handleOpenEditDialog = (index: number): void => {
      setActiveIndex(index)
      toggleMainModal("edit", true)
   }

   const handleEditEntity = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      await handleRequest(RequestMethodEnum.PATCH, "settings", toggleMainModal, {
         settingName: formData.settingName,
         settingValue: formData.settingValue
      })
   }

   return (
      <AdminLayout serverError={serverErrorMessage}>
         {data.length
            ? data.map((item, index) => (
               <Box key={item.id} sx={{ flexGrow: 1, backgroundColor: "#e8e8e8", paddingBottom: "24px", marginBottom: "24px" }}>
                  <Grid container spacing={3} sx={{ mx: "auto", justifyContent: "center" }}>
                     <Grid item>
                        <Item>{item.settingName}</Item>
                     </Grid>
                     <Grid item>
                        <Item>{item.settingValue}</Item>
                     </Grid>
                     <Grid item>
                        <Item>{moment.utc(item.updatedAt).local().format("DD/MM/YYYY HH:mm")}</Item>
                     </Grid>
                     {item.settingName === "webhook.url"
                        ? <>
                           <Grid item>
                              <Button color="error" size="medium"
                                      type="button"
                                      variant="contained"
                                      onClick={handleRedeployApp}
                              >
                                 Redeploy Application
                              </Button>
                           </Grid>
                           <Grid item>
                              <Button color="warning" size="medium"
                                      type="button"
                                      variant="contained"
                                      onClick={(): void => handleOpenEditDialog(index)}>
                                 Change Webhook Url
                              </Button>
                           </Grid>
                        </>
                        : null}
                  </Grid>
               </Box>
            ))
            : <Typography color="error" variant="subtitle2">No records found</Typography>}

         {isStatusModalOpen.loading &&
            <DialogStatus handleCloseDialog={(): void => toggleLoading(false)} isOpen={isStatusModalOpen.loading}
                          status={DialogStatusEnum.LOADING}/>}
         {isStatusModalOpen.error &&
            <DialogStatus error={error} handleCloseDialog={(): void => toggleError()}
                          isOpen={isStatusModalOpen.error} status={DialogStatusEnum.ERROR}/>}

         {isMainModalOpen.edit &&
            <DialogWithInputs description="Please, submit form in order to edit necessary fields"
                              handleCloseDialog={(): void => toggleMainModal("edit", false)}
                              isOpen={isMainModalOpen.edit}
                              title={data[activeIndex].settingName}>
               <DialogForm handleCloseDialog={(): void => toggleMainModal("edit", false)}
                           handleFormSubmit={handleEditEntity}
                           initialState={data[activeIndex]}>
                  {Object.keys(data[activeIndex]).map(item => (
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
      </AdminLayout>
   )
}

export default Settings

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const settings = await axios.get(`${process.env.URL}/api/settings`,
         { headers: { Cookie: cookie || "" } })
      const { data } = settings
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}