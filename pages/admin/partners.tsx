import React from "react"

import axios from "axios"
import dynamic from "next/dynamic"

import { Loading } from "@components/admin"

import type { AdminPageType } from "@customTypes/admin/components"
import type { PartnersPageType } from "@customTypes/admin/pages"
import type { TextFieldProps } from "@mui/material/TextField"
import type { GetServerSideProps, NextPage } from "next"

const AdminPage = dynamic<AdminPageType>(() => import("@components/admin/AdminPage").then(module => module.AdminPage),
   { loading: () => <Loading isOpen={true} message="Main Component"/> })
const Input = dynamic<TextFieldProps>(() => import("@components/admin").then(module => module.Input))

const initialValuesAddPartner = {
   name: "",
   link: "",
   imageUrl: ""
}

const PartnersPage: NextPage<PartnersPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   return (
      <AdminPage data={data} endpoint="partners" initialValues={initialValuesAddPartner}
                 name="Partner" serverErrorMessage={serverErrorMessage}>
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
      const services = await axios.get(`${process.env.URL}/api/partners`,
         { headers: { Cookie: cookie || "" } })
      const { data } = services
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}