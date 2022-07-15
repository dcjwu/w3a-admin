export type DataTableType = {
   tableColumns: string[],
   tableRows: string[][],
   handleOpenDeleteDialog: (id: string) => void,
   handleOpenEditDialog: (index: number) => void
}