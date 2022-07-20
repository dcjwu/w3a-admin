import React from "react"

import axios from "axios"

import AdminLayout from "@layouts/admin/AdminLayout"

import type { AdminPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const AdminPage: NextPage<AdminPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   console.table(data)

   return (
      <AdminLayout serverError={serverErrorMessage}>
         Admin Panel
      </AdminLayout>
   )
}

export default AdminPage

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