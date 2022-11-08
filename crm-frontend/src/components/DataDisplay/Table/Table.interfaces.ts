export interface ITableProps {
  tableId: string | "table"
  columns: any
  fetchUsersData: Function
  queryKey: string
  onRowClick?: Function
  getData?: Function
}

export interface IOnClickFilterCallbackProps {
  filter: string
  keyword: string
  setUseFilter: React.ComponentState
  setKeyword: React.ComponentState
}
export interface IOnNextPageImplementationProps {
  tableScrollerRef: React.RefObject<HTMLDivElement>
  page: any
  pageCount: number | undefined
  nextPage: Function
  isPreviousData?: boolean
}
export interface IGetAnimatedRowsProps {
  length: number
  element: JSX.Element
}
export interface IRowProps {
  RowAnimation: any
  page: any
  isFetching: boolean
  prepareRow: any
  shortid: any
  onRowClick?: Function
  cellSize: string
}
