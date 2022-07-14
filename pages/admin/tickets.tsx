import axios from "axios"

import AdminLayout from "@layouts/admin/AdminLayout"

import type { MessagesPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const MessagesPage: NextPage<MessagesPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   console.table(data)

   return (
      <AdminLayout serverError={serverErrorMessage}>
         Messages Page
      </AdminLayout>
   )
}

export default MessagesPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const messages = await axios.get(`${process.env.URL}/api/tickets`,
         { headers: { Cookie: cookie || "" } })
      const { data } = messages
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}