import React from "react"

import type { EditableRowType, TableColumnsType, TableRowsType } from "@customTypes/admin/common"
import type { UseEditableRowType } from "@customTypes/admin/hooks"

export const useEditableRow = (): UseEditableRowType  => {
   const [editableRow, setEditableRow] = React.useState<EditableRowType>({})

   const handleEditableRow = (columns: TableColumnsType, rows: TableRowsType, index: number): void => {
      const editableFields = Object
         .fromEntries((columns.map((_, i) => [columns[i], rows[index][i]])))

      setEditableRow(editableFields)
   }

   return [editableRow, handleEditableRow]
}