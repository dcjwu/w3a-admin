export type UseEditableRowType = [
   {[p: string]: string},
   ((columns: string[], rows: string[][], index: number) => void)
]