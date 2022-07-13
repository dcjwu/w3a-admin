import React from "react"

import axios from "axios"
import { GetServerSideProps, NextPage } from "next"

import AdminView from "@components/admin/AdminView"

import type { AdminPageType } from "@customTypes/admin/pages"

const AdminPage: NextPage<AdminPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   console.table(data)

   return (
      <AdminView serverError={serverErrorMessage}>
         Admin Panel
      </AdminView>
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