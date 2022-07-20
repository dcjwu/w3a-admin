import React from "react"

export const useDataTable = <T>(data: T[]): [string[], string[][]] => {
   const [tableColumns, setTableColumns] = React.useState<string[]>([])
   const [tableRows, setTableRows] = React.useState<string[][]>([])

   React.useEffect(() => {
      const rows: string[][] = []
      data.map(item => {
         setTableColumns(Object.keys(item))
         const items = Object.values(item) as string[]
         rows.push(items)
         setTableRows(rows)
      })
   }, [data]) //TODO: useCallback/useMemo usage?

   return [tableColumns, tableRows]
}