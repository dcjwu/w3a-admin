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

const initialValuesAddUser = {
   name: "",
   email: "",
   password: "",
   imageUrl: ""
}

const UsersPage: NextPage<AdminPageType> = ({ data, serverErrorMessage }): JSX.Element => {
   
   return (
      <AdminPage data={data} editableFields={["name", "email", "imageUrl"]} endpoint="users"
                 initialValues={initialValuesAddUser} name="User" serverErrorMessage={serverErrorMessage}>
         <Input autoFocus
                fullWidth
                required
                label="User's name"
                margin="normal"
                name="name"
                type="text"
                variant="standard"
         />
         <Input fullWidth
                required
                label="User's email"
                margin="normal"
                name="email"
                type="email"
                variant="standard"
         />
         <Input fullWidth
                label="User's image URL"
                margin="normal"
                name="imageUrl"
                type="text"
                variant="standard"
         />
         <Input fullWidth
                required
                label="User's password"
                margin="normal"
                name="password"
                type="text"
                variant="standard"
         />
      </AdminPage>
   )
}

export default UsersPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const users = await axios.get(`${process.env.URL}/api/users`,
         { headers: { Cookie: cookie || "" } })
      const { data } = users
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}