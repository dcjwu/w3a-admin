import React from "react"

import Button from "@mui/material/Button"
import axios from "axios"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { Loading } from "@components/admin"

import type { AdminLayoutType } from "@customTypes/admin/layouts"
import type { TicketsByIdPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })

const TicketsPageById: NextPage<TicketsByIdPageType> = ({ data, serverErrorMessage }): JSX.Element => {

   const router = useRouter()

   return (
      <AdminLayout serverError={serverErrorMessage}>
         <Button color="info" size="large"
                 sx={{
                    mt: 3,
                    mb: 2
                 }}
                 type="button"
                 variant="contained"
                 onClick={(): void => router.back()}
         >
            Go Back
         </Button>
         <h1>{data.id}</h1>
      </AdminLayout>
   )
}

export default TicketsPageById

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers
   const { query } = context

   try {
      const tickets = await axios.get(`${process.env.URL}/api/tickets/${query.id}`,
         { headers: { Cookie: cookie || "" } })
      const { data } = tickets
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}