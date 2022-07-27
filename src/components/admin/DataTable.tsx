import React from "react"

import Button from "@mui/material/Button"
import Link from "@mui/material/Link"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import moment from "moment"

import { capitalizeWord } from "@utils/capitalizeWord"
import { isInputArray } from "@utils/isInputArray"
import { isStringDate } from "@utils/isStringDate"
import { isStringUrl } from "@utils/isStringUrl"

import type { DataTableType } from "@customTypes/admin/components"

export const DataTable: React.FC<DataTableType> = ({
   tableColumns,
   tableRows,
   handleOpenDeleteDialog,
   handleOpenEditDialog
}): JSX.Element => {
   return (
      <Paper sx={{
         width: "100%",
         overflow: "hidden"
      }}>
         <TableContainer>
            <Table stickyHeader aria-label="sticky table">
               <TableHead>
                  <TableRow>
                     {tableColumns.map((column) => (
                        <TableCell key={column}
                                   align="center"
                                   style={{ minWidth: 170 }}
                        >
                           {capitalizeWord(column)}
                        </TableCell>
                     ))}
                     <TableCell align="center">
                        Edit
                     </TableCell>
                     <TableCell align="center">
                        Delete
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {tableRows
                     .map((row, indexRow) => {
                        return (
                           <TableRow key={row[0]} hover
                                     tabIndex={-1}>
                              {row.map((column, index) => {
                                 return (
                                    <TableCell key={column + index} align="center">
                                       {isStringDate(column)
                                          ? moment(column).format("DD/MM/YYYY HH:mm")
                                          : isStringUrl(column)
                                             ? <Link color="info.main" href={column}
                                                     target="_black" underline="hover"
                                                     variant="subtitle2">
                                                {capitalizeWord(tableColumns[index])}
                                             </Link>
                                             : isInputArray(column)
                                                ? `[${column}]`
                                                : column}
                                    </TableCell>
                                 )
                              })}
                              <TableCell align="center">
                                 <Button color="warning" sx={{
                                    mt: 3,
                                    mb: 2
                                 }}
                                         type="button"
                                         variant="outlined"
                                         onClick={(): void => handleOpenEditDialog(indexRow)}
                                 >
                                    Edit
                                 </Button>
                              </TableCell>
                              <TableCell align="center">
                                 <Button color="error" sx={{
                                    mt: 3,
                                    mb: 2
                                 }} type="button"
                                         variant="outlined"
                                         onClick={(): void => handleOpenDeleteDialog(row[0])}
                                 >
                                    Delete
                                 </Button>
                              </TableCell>
                           </TableRow>
                        )
                     })}
               </TableBody>
            </Table>
         </TableContainer>
      </Paper>
   )
}