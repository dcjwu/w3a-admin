import React from "react"

import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

import type { DataTableType } from "@customTypes/admin/components"

export const DataTable: React.FC<DataTableType> = ({
   tableColumns,
   tableRows
}): JSX.Element => {
   return (
      <Paper sx={{
         width: "100%",
         overflow: "hidden"
      }}>
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
                  {tableRows
                     .map((row) => {
                        return (
                           <TableRow key={row[0]} hover
                                     tabIndex={-1}>
                              {row.map((column) => {
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
   )
}