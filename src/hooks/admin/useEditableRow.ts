import React from "react"

import type { UseEditableRowType } from "@customTypes/admin/hooks"

export const useEditableRow = (): UseEditableRowType  => {
   const [editableRow, setEditableRow] = React.useState<{ [k: string]: string; }>({})

   const handleEditableRow = (columns: string[], rows: string[][], index: number): void => {
      const editableFields = Object
         .fromEntries((columns.map((_, i) => [columns[i], rows[index][i]])))

      setEditableRow(editableFields)
   }

   return [editableRow, handleEditableRow]
}