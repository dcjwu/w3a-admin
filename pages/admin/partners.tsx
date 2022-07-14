import React from "react"

import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TextField from "@mui/material/TextField"
import axios from "axios"

import { DialogForm } from "@components/admin"
import AdminLayout from "@layouts/admin/AdminLayout"

import type { PartnersPageType } from "@customTypes/admin/pages"
import type { GetServerSideProps, NextPage } from "next"

const PartnersPage: NextPage<PartnersPageType> = ({
   data,
   serverErrorMessage
}): JSX.Element => {

   const [isModalOpen, setIsModalOpen] = React.useState(false)
   const [tableColumns, setTableColumns] = React.useState<string[]>([])
   const [tableRows, setTableRows] = React.useState<string[]>([])

   const handleCloseDialog = (): void => {
      setIsModalOpen(false)
   }

   const handleSubmitForm = (event: React.SyntheticEvent): void => {
      event.preventDefault()
      setIsModalOpen(false)
   }

   React.useEffect(() => {
      data.map(item => {
         setTableColumns(Object.keys(item))
         setTableRows(Object.values(item))
      })
   }, [])

   return (
      <AdminLayout serverError={serverErrorMessage}>
         {isModalOpen &&
            <DialogForm description="Please, submit form in order to add a New Partner entity."
                        handleCloseDialog={handleCloseDialog} handleSubmitForm={handleSubmitForm}
                        isOpen={isModalOpen} title="Add New Partner">
               <TextField autoFocus
                          fullWidth
                          required
                          id="name"
                          label="Partner's name"
                          margin="normal"
                          type="text"
                          variant="standard"
               />
               <TextField autoFocus
                          fullWidth
                          required
                          id="link"
                          label="Partner's website URL"
                          margin="normal"
                          type="text"
                          variant="standard"
               />
               <TextField autoFocus
                          fullWidth
                          required
                          id="imageUrl"
                          label="Partner's logo URL"
                          margin="normal"
                          type="text"
                          variant="standard"
               />
            </DialogForm>}
         <Button color="info"
                 size="large"
                 sx={{
                    mt: 3,
                    mb: 2
                 }}
                 type="button"
                 variant="contained"
                 onClick={(): void => setIsModalOpen(true)}
         >
            Add new Partner
         </Button>
         <Paper sx={{
            width: "100%",
            overflow: "hidden"
         }}>
            {/*TODO: Rewrite logic from https://mui.com/material-ui/react-table/*/}
            <TableContainer sx={{ maxHeight: 440 }}>
               <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                     <TableRow>
                        {tableColumns.map((column) => (
                           <TableCell key={column}
                                      align="center"
                                      style={{ minWidth: 170 }}
                           >
                              {column.charAt(0).toUpperCase() + column.slice(1)}
                           </TableCell>
                        ))}
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data
                        .map((row) => {
                           return (
                              <TableRow key={row.id} hover
                                        tabIndex={-1}>
                                 {tableRows.map((column) => {
                                    return (
                                       <TableCell key={column} align="center">
                                          {column}
                                       </TableCell>
                                    )
                                 })}
                              </TableRow>
                           )
                        })}
                  </TableBody>
               </Table>
            </TableContainer>
         </Paper>
      </AdminLayout>
   )
}

export default PartnersPage

export const getServerSideProps: GetServerSideProps = async context => {
   const { cookie } = context.req.headers

   try {
      const services = await axios.get(`${process.env.URL}/api/partners`,
         { headers: { Cookie: cookie || "" } })
      const { data } = services
      return { props: { data } }
   } catch (err) {
      return { props: { serverErrorMessage: err.response.data.message } }
   }
}