import React from "react"

import axios from "axios"
import { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"

import { Dropdown, Loading } from "@components/admin"
import { AdminPageComponentType } from "@customTypes/admin/components"

import type { AdminPageType } from "@customTypes/admin/pages"
import type { TextFieldProps } from "@mui/material/TextField"

const AdminPage = dynamic<AdminPageComponentType>(() => import("@components/admin/AdminPage").then(module => module.AdminPage),
   { loading: () => <Loading isOpen={true} message="Main Component"/> })
const Input = dynamic<TextFieldProps>(() => import("@components/admin").then(module => module.Input))

const initialValuesAddTechnology = {
   name: "",
   category: "",
   imageUrl: "",
   link: ""
}

const dropdownValuesCategory = ["FRAMEWORKS", "DBMS", "BLOCKCHAINS", "LANGUAGES", "CLOUD_PLATFORMS"]

const StackPage: NextPage<AdminPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   return (
      <AdminPage data={data} editableFields={Object.keys(initialValuesAddTechnology)} endpoint="technologies"
                 initialValues={initialValuesAddTechnology} name="Technology" serverErrorMessage={serverErrorMessage}>
         <Dropdown dropdownItems={dropdownValuesCategory} label="Technology category" name="category"/>
         <Input autoFocus
                fullWidth
                required
                label="Technology name"
                margin="normal"
                name="name"
                type="text"
                variant="standard"
         />
         <Input fullWidth
            required
            label="Technology image URL"
            margin="normal"
            name="imageUrl"
            type="text"
            variant="standard"
         />
         <Input fullWidth
                required
                label="Technology URL"
                margin="normal"
                name="link"
                type="text"
                variant="standard"
         />
      </AdminPage>
   )
}

export default StackPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const services = await axios.get(`${process.env.URL}/api/technologies`,
         { headers: { Cookie: cookie || "" } })
      const { data } = services
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}