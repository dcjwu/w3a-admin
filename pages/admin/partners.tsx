import React from "react"

import axios from "axios"
import dynamic from "next/dynamic"

import { Loading } from "@components/admin"

import type { AdminPageComponentType } from "@customTypes/admin/components"
import type { AdminPageType } from "@customTypes/admin/pages"
import type { TextFieldProps } from "@mui/material/TextField"
import type { GetServerSideProps, NextPage } from "next"

const AdminPage = dynamic<AdminPageComponentType>(() => import("@components/admin/AdminPage").then(module => module.AdminPage),
   { loading: () => <Loading isOpen={true} message="Main Component"/> })
const Input = dynamic<TextFieldProps>(() => import("@components/admin").then(module => module.Input))

const initialValuesAddPartner = {
   name: "",
   link: "",
   imageUrl: ""
}

const PartnersPage: NextPage<AdminPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   return (
      <AdminPage data={data} editableFields={Object.keys(initialValuesAddPartner)} endpoint="partners"
                 initialValues={initialValuesAddPartner} name="Partner" serverErrorMessage={serverErrorMessage}>
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
      </AdminPage>
   )
}

export default PartnersPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const partners = await axios.get(`${process.env.URL}/api/partners`,
         { headers: { Cookie: cookie || "" } })
      const { data } = partners
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}