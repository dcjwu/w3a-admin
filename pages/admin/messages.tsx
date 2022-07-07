import axios from "axios"

import AdminView from "@components/admin/AdminView"

import type { MessagesPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const MessagesPage: NextPage<MessagesPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   console.log(data)

   return (
      <AdminView serverError={serverErrorMessage}>
         Messages Page
      </AdminView>
   )
}

export default MessagesPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const messages = await axios.get(`${process.env.URL}/api/messages`,
         { headers: { Cookie: cookie || "" } })
      const { data } = messages
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}