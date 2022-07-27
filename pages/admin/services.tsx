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

const initialValuesAddService = {
   name: "",
   description: ""
}

const ServicesPage: NextPage<AdminPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   return (
      <AdminPage data={data} editableFields={Object.keys(initialValuesAddService)} endpoint="services"
                 initialValues={initialValuesAddService} name="Service" serverErrorMessage={serverErrorMessage}>
         <Input autoFocus
                fullWidth
                required
                label="Service name"
                margin="normal"
                name="name"
                type="text"
                variant="standard"
         />
         <Input
            fullWidth
            required
            label="Service description"
            margin="normal"
            name="description"
            type="text"
            variant="standard"
         />
      </AdminPage>
   )
}

export default ServicesPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const services = await axios.get(`${process.env.URL}/api/services`,
         { headers: { Cookie: cookie || "" } })
      const { data } = services
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}