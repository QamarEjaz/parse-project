import React, { useState, useEffect, useRef } from "react"
import { useTable, usePagination, useSortBy } from "react-table"
import { useQuery } from "@tanstack/react-query"
import shortid from "shortid"
import { ChevronDownIcon, ChevronUpIcon, SwitchVerticalIcon } from "@heroicons/react/solid"

import Error from "../Error"
import UsersFilter from "./TableFilter"

import { initialState, reducer, PAGE_CHANGED, PAGE_SIZE_CHANGED, PAGE_SORT_CHANGED, PAGE_FILTER_CHANGED, TOTAL_COUNT_CHANGED } from "./Table.state"
import { ITableProps } from "./Table.interfaces"
import { RowAnimation } from "./Table.styles"

import { onClickFilterCallback, onNextPageImplementation, getRows, handleResize, MessageWrapper } from "./Table.utils"

const Table = ({ tableId, columns, fetchUsersData, queryKey, onRowClick, getData }: ITableProps): JSX.Element => {
  const tableScrollerRef = useRef<HTMLDivElement>(null)
  const cellSize = "px-6 py-3"
  const [keyword, setKeyword] = useState("")
  const [useFilter, setUseFilter] = useState(false)

  const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy }, dispatch] = React.useReducer(reducer, initialState)

  const { error, data, isSuccess, isFetching, isPreviousData } = useQuery([queryKey, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy], () => fetchUsersData({ queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy }), {
    keepPreviousData: true,
    staleTime: Infinity,
  })

  const totalPageCount = Math.ceil(totalCount / queryPageSize)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    nextPage,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data: data?.results || [],
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
        sortBy: queryPageSortBy,
      },
      manualPagination: true,
      pageCount: data ? data?.count : totalPageCount,
      autoResetSortBy: false,
      autoResetExpanded: false,
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  )

  const conditions = {
    loading: isFetching && data?.count === undefined,
    error: error,
    noData: isSuccess && !isFetching && page.length < 1,
    render: !error && !(isSuccess && !isFetching && page.length < 1),
  }

  useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: pageIndex })
  }, [pageIndex])

  useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize })
    gotoPage(1)
  }, [pageSize, gotoPage])

  useEffect(() => {
    dispatch({ type: PAGE_SORT_CHANGED, payload: sortBy })
    gotoPage(1)
  }, [sortBy, gotoPage])

  useEffect(() => {
    if (useFilter) {
      dispatch({ type: PAGE_FILTER_CHANGED, payload: keyword })
      gotoPage(1)
    }
  }, [keyword, gotoPage, useFilter])

  useEffect(() => {
    if (data?.count) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: data.count,
      })
    }
    getData && getData({ initialState, data })
  }, [data?.count])

  useEffect(() => {
    handleResize(document.getElementById(tableId))
    window.addEventListener("resize", handleResize)
  }, [conditions.loading, isFetching, keyword, conditions.noData])

  if (conditions.loading) {
    return <MessageWrapper>{<Error type="loading" styles={{ position: "absolute", top: "0", right: "0", left: "0", bottom: "0" }} />}</MessageWrapper>
  }

  return (
    <>
      <div className="sm:flex sm:gap-x-2">
        <div className="flex space-x-5 w-full">
          <UsersFilter onClickFilterCallback={(filter): void => onClickFilterCallback({ filter, keyword, setUseFilter, setKeyword })} defaultKeyword={keyword} />
        </div>
      </div>
      {conditions.error && <MessageWrapper>{<Error type="error" title="Error" message="Something went wrong!" styles={{ position: "absolute", top: "0", right: "0", left: "0", bottom: "0" }} />}</MessageWrapper>}
      {conditions.noData && <MessageWrapper>{<Error type="no-data" title="Oops" message="No Data Found" styles={{ position: "absolute", top: "0", right: "0", left: "0", bottom: "0" }} />}</MessageWrapper>}
      {conditions.render && (
        <>
          <div className="mt-4 flex flex-1 flex-col font-medium relative" id={tableId}>
            <div className="-my-2 overflow-hidden pr-0.5 sm:-mx-6 lg:-mx-8 flex-1 flex-col">
              <div className="py-2 align-middle min-w-full sm:px-6 lg:px-8 flex flex-1 h-full flex-col">
                <div className="overflow-auto p-2 -m-1.5 sm:p-1 sm:-m-1 h-full dark:border-transparent" onScroll={(): any => onNextPageImplementation({ tableScrollerRef, page, nextPage, pageCount: data?.count, isPreviousData })} ref={tableScrollerRef}>
                  <table {...getTableProps()} className="relative shadow rounded-lg border-b border-collapse border-gray-200 dark:border-b-0 min-w-full divide-y divide-gray-200 dark:divide-black-700">
                    <thead className="bg-white dark:bg-black-900 text-gray-400">
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={`${shortid.generate()}`}>
                          {headerGroup.headers.map((column) => (
                            <th scope="col" className={`group ${cellSize} text-left text-sm font-semibold dark:text-white text-gray-400 uppercase tracking-wider`} {...column.getHeaderProps(column.getSortByToggleProps())}>
                              {column.render("Header")}

                              <span className="inline-block float-right">
                                {column.isSorted ? column.isSortedDesc ? <ChevronDownIcon className="w-4 h-4 text-gray-400" /> : <ChevronUpIcon className="w-4 h-4 text-gray-400" /> : <SwitchVerticalIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="bg-white dark:bg-black-900 relative" id={`${tableId}-body`} {...getTableBodyProps()}>
                      {getRows({ RowAnimation, isFetching, page, prepareRow, shortid, onRowClick, cellSize })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

const TableWrapper = ({ tableId, columns, fetchUsersData, queryKey, onRowClick, getData }: ITableProps): JSX.Element => {
  return <Table tableId={tableId} columns={columns} fetchUsersData={fetchUsersData} queryKey={queryKey} onRowClick={onRowClick} getData={getData} />
}

export default TableWrapper
