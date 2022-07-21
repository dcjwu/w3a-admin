import type { EditableRowType, TableColumnsType, TableRowsType } from "@customTypes/admin/common"

export type UseEditableRowType = [
   EditableRowType,
   ((columns: TableColumnsType, rows: TableRowsType, index: number) => void)
]