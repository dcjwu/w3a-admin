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

const initialValuesAddProject = {
   name: "",
   description: "",
   imageUrl: "",
   keywords: ""
}

const ProjectsPage: NextPage<AdminPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   return (
      <AdminPage data={data} editableFields={Object.keys(initialValuesAddProject)} endpoint="projects"
                 initialValues={initialValuesAddProject} name="Project" serverErrorMessage={serverErrorMessage}>
         <Input autoFocus
                fullWidth
                required
                label="Project name"
                margin="normal"
                name="name"
                type="text"
                variant="standard"
         />
         <Input fullWidth
                required
                label="Project description"
                margin="normal"
                name="description"
                type="text"
                variant="standard"
         />
         <Input fullWidth
                required
                label="Project image URL"
                margin="normal"
                name="imageUrl"
                type="text"
                variant="standard"
         />
         <Input fullWidth
                required
                label="Project keywords"
                margin="normal"
                name="keywords"
                type="text"
                variant="standard"
         />
      </AdminPage>
   )
}

export default ProjectsPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const projects = await axios.get(`${process.env.URL}/api/projects`,
         { headers: { Cookie: cookie || "" } })
      const { data } = projects
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}