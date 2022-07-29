import axios from "axios"
import dynamic from "next/dynamic"

import { Loading } from "@components/admin"

import type { AdminLayoutType } from "@customTypes/admin/layouts"
import type { AdminPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })

const TicketsPage: NextPage<AdminPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   console.table(data)

   return (
      <AdminLayout serverError={serverErrorMessage}>
         Tickets Page
      </AdminLayout>
   )
}

export default TicketsPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const tickets = await axios.get(`${process.env.URL}/api/tickets`,
         { headers: { Cookie: cookie || "" } })
      const { data } = tickets
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}