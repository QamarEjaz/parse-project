import { IOnClickFilterCallbackProps, IOnNextPageImplementationProps, IGetAnimatedRowsProps, IRowProps } from "./Table.interfaces"

export const onClickFilterCallback = ({ filter, keyword, setUseFilter, setKeyword }: IOnClickFilterCallbackProps): void => {
  if (filter === keyword) {
    window.alert("No change in search")
    return
  }
  setUseFilter(true)
  setKeyword(filter)
}

export const onNextPageImplementation = ({ tableScrollerRef, page, nextPage, pageCount, isPreviousData }: IOnNextPageImplementationProps): void => {
  if (tableScrollerRef.current) {
    const { scrollTop, scrollHeight, clientHeight } = tableScrollerRef.current
    if (Math.round(-(scrollTop + clientHeight)) === -scrollHeight && page.length > 0 && !isPreviousData && page?.length !== pageCount) {
      // Reached the bottom of table
      nextPage()
    }
  }
}

export const getRows = ({ RowAnimation, isFetching, page, prepareRow, shortid, onRowClick, cellSize }: IRowProps): any => {
  return page.map((row: any) => {
    prepareRow(row)
    return (
      <tr {...row.getRowProps()} className="hover:bg-gray-100 dark:hover:bg-black-800 transition duration-200 cursor-pointer" key={`${shortid.generate()}`} onClick={onRowClick ? (page): void => onRowClick(page) : null}>
        {row.cells.map((cell: any) => {
          return (
            <td {...cell.getCellProps()} className={`${cellSize} whitespace-nowrap text-sm`} role="cell">
              <RowAnimation animate={isFetching}>{!isFetching && cell.render("Cell")}</RowAnimation>
            </td>
          )
        })}
      </tr>
    )
  })
}

export const handleResize = (table: any): void => {
  if (table) {
    const tableTop = table?.getBoundingClientRect?.()?.top

    if (table.style && table.style.height !== undefined) {
      table.style.height = window.innerHeight - tableTop - 35 + "px"
    }
  }
}

export const MessageWrapper: React.FC<{ children: JSX.Element }> = ({ children }) => (
  <div className="mt-4 flex flex-1 flex-col font-medium relative">
    <div className="-my-2 overflow-hidden pr-0.5 sm:-mx-6 lg:-mx-8 flex-1 flex-col">
      <div className="py-2 align-middle min-w-full sm:px-6 lg:px-8 flex flex-1 h-full flex-col">
        <div className="overflow-auto p-2 -m-1.5 sm:p-1 sm:-m-1 h-full dark:border-transparent">{children}</div>
      </div>
    </div>
  </div>
)

export const getQueryResponse = ({ Parse, queryPageFilter, queryPageSortBy, queryPageSize, queryPageIndex, queryTable, status }: { Parse: any; queryPageFilter: any; queryPageSortBy: any; queryPageSize: any; queryPageIndex: any; queryTable: any; status: any }) => {
  const response = new Parse.Query(queryTable)
  response.include(["patient", "appointment", "appointment.operatory", "appointment.provider", "appointment.location"])
  // response.include("appointment")
  response.equalTo("status", status)

  if (queryPageFilter) {
    response.fullText("name", queryPageFilter)
  }
  if (queryPageSortBy?.length > 0) {
    queryPageSortBy.map((sort: any) => {
      if (sort.desc) {
        response.descending("name")
      } else {
        response.ascending("name")
      }
    })
  }

  response.withCount()
  // response.skip(10 * queryPageIndex) // queryPageIndex
  response.limit(queryPageSize * queryPageIndex) // queryPageSize

  return response
}
