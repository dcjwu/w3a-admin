import React from "react"

import axios from "axios"
import { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"

import { Loading } from "@components/admin"
import { AdminPageComponentType } from "@customTypes/admin/components"
import { AdminPageType } from "@customTypes/admin/pages"

import type { TextFieldProps } from "@mui/material/TextField"

const AdminPage = dynamic<AdminPageComponentType>(() => import("@components/admin/AdminPage").then(module => module.AdminPage),
   { loading: () => <Loading isOpen={true} message="Main Component"/> })
const Input = dynamic<TextFieldProps>(() => import("@components/admin").then(module => module.Input))

const initialValuesAddTeamMember = {
   name: "",
   title: "",
   imageUrl: "",
   linkedinUrl: ""
}

const TeamPage: NextPage<AdminPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   return (
      <AdminPage data={data} editableFields={Object.keys(initialValuesAddTeamMember)} endpoint="members"
                 initialValues={initialValuesAddTeamMember} name="Team Member" serverErrorMessage={serverErrorMessage}>
         <Input autoFocus
                fullWidth
                required
                label="Team member's name"
                margin="normal"
                name="name"
                type="text"
                variant="standard"
         />
         <Input fullWidth
                required
                label="Team member's title"
                margin="normal"
                name="title"
                type="text"
                variant="standard"
         />
         <Input fullWidth
                required
                label="Team member's image URL"
                margin="normal"
                name="imageUrl"
                type="text"
                variant="standard"
         />
         <Input fullWidth
                required
                label="Team member's LinkedIn URL"
                margin="normal"
                name="linkedinUrl"
                type="text"
                variant="standard"
         />
      </AdminPage>
   )
}

export default TeamPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const members = await axios.get(`${process.env.URL}/api/members`,
         { headers: { Cookie: cookie || "" } })
      const { data } = members
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}