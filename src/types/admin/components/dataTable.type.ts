import type { TableColumnsType, TableRowsType } from "@customTypes/admin/common"

export type DataTableType = {
   tableColumns: TableColumnsType,
   tableRows: TableRowsType,
   handleOpenDeleteDialog: (id: string) => void,
   handleOpenEditDialog: (index: number) => void,
}