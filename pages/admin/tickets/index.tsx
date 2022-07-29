import React from "react"

import { Link as MuiLink } from "@mui/material"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import axios from "axios"
import moment from "moment/moment"
import dynamic from "next/dynamic"
import Link from "next/link"

import { Loading } from "@components/admin"
import { TicketStatusEnum } from "@customTypes/admin/pages"

import type { AdminLayoutType } from "@customTypes/admin/layouts"
import type { TicketsPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const Card = dynamic(import("@mui/material/Card"))
const CardActions = dynamic(import("@mui/material/CardActions"))
const CardContent = dynamic(import("@mui/material/CardContent"))

const AdminLayout = dynamic<AdminLayoutType>(import("@layouts/admin/AdminLayout"), { loading: () => <Loading isOpen={true} message="Layout"/> })

const TicketsPage: NextPage<TicketsPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   const isTicketActive = (status: TicketStatusEnum): boolean => {
      return status === TicketStatusEnum.ACTIVE
   }

   //TODO: Add dropdown to change status on button click
   //TODO: Add another button as [id] page per ticket to display all data with button to change status and reply
   // (auto set status to replied?)
   //TODO: Add search and filter

   return (
      <AdminLayout serverError={serverErrorMessage}>
         {data.map(item => (
            <Card key={item.id} sx={{
               minWidth: 275,
               marginBottom: "16px"
            }}>
               <CardContent>
                  <Typography gutterBottom color="text.secondary" sx={{ fontSize: 14 }}>
                     Date: {moment.utc(item.createdAt).local().format("DD/MM/YYYY HH:mm")}
                  </Typography>
                  <Typography gutterBottom color="text.secondary" sx={{ fontSize: 14 }}>
                     IP Address: {item.ipAddress}
                  </Typography>
                  <Typography component="div" variant="h5">
                     {item.topic}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                     {item.email}
                  </Typography>
               </CardContent>
               <CardActions>
                  <Button color={isTicketActive(item.status) ? "success" : "error"} size="large" sx={{ marginRight: "8px" }}
                          variant="contained">{isTicketActive(item.status) ? "ACTIVE" : "CLOSED"}</Button>
                  <Link href={`tickets/${item.id}`}>
                     <MuiLink underline="none">
                        <Button size="large">View</Button>
                     </MuiLink>
                  </Link>
               </CardActions>
            </Card>
         ))}
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