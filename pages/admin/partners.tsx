import React from "react"

import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import axios from "axios"

import { DialogForm } from "@components/admin"
import { DataTable } from "@components/admin/DataTable"
import { useDataTable } from "@hooks/useDataTable"
import AdminLayout from "@layouts/admin/AdminLayout"

import type { PartnersPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const PartnersPage: NextPage<PartnersPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   const [isModalOpen, setIsModalOpen] = React.useState(false)
   const [tableColumns, tableRows] = useDataTable(data)

   const handleCloseDialog = (): void => {
      setIsModalOpen(false)
   }

   const handleSubmitForm = (event: React.SyntheticEvent): void => {
      event.preventDefault()
      setIsModalOpen(false)
   }

   return (
      <AdminLayout serverError={serverErrorMessage}>
         {isModalOpen &&
            <DialogForm description="Please, submit form in order to add a New Partner entity."
                        handleCloseDialog={handleCloseDialog} handleSubmitForm={handleSubmitForm}
                        isOpen={isModalOpen} title="Add New Partner">
               <TextField autoFocus
                          fullWidth
                          required
                          id="name"
                          label="Partner's name"
                          margin="normal"
                          type="text"
                          variant="standard"
               />
               <TextField autoFocus
                          fullWidth
                          required
                          id="link"
                          label="Partner's website URL"
                          margin="normal"
                          type="text"
                          variant="standard"
               />
               <TextField autoFocus
                          fullWidth
                          required
                          id="imageUrl"
                          label="Partner's logo URL"
                          margin="normal"
                          type="text"
                          variant="standard"
               />
            </DialogForm>}
         <Button color="info"
                 size="large"
                 sx={{
                    mt: 3,
                    mb: 2
                 }}
                 type="button"
                 variant="contained"
                 onClick={(): void => setIsModalOpen(true)}
         >
            Add new Partner
         </Button>
         <DataTable tableColumns={tableColumns} tableRows={tableRows}/>
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