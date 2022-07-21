import React from "react"

import type { TableColumnsType, TableRowsType } from "@customTypes/admin/common"

export const useDataTable = <T>(data: T[]): [TableColumnsType, TableRowsType] => {
   const [tableColumns, setTableColumns] = React.useState<TableColumnsType>([])
   const [tableRows, setTableRows] = React.useState<TableRowsType>([])

   React.useEffect(() => {
      const rows: TableRowsType = []
      data.map(item => {
         setTableColumns(Object.keys(item))
         const items = Object.values(item) as string[]
         rows.push(items)
         setTableRows(rows)
      })
   }, [data])

   return [tableColumns, tableRows]
}