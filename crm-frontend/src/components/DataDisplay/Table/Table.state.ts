export const initialState = {
  queryPageIndex: 1,
  queryPageSize: 100,
  totalCount: undefined,
  queryPageFilter: "",
  queryPageSortBy: [],
}

export const PAGE_CHANGED = "PAGE_CHANGED"
export const PAGE_SIZE_CHANGED = "PAGE_SIZE_CHANGED"
export const PAGE_SORT_CHANGED = "PAGE_SORT_CHANGED"
export const PAGE_FILTER_CHANGED = "PAGE_FILTER_CHANGED"
export const TOTAL_COUNT_CHANGED = "TOTAL_COUNT_CHANGED"

export const reducer = (state: any, { type, payload }: any): any => {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      }
    case PAGE_SIZE_CHANGED:
      return {
        ...state,
        queryPageSize: payload,
      }
    case PAGE_SORT_CHANGED:
      return {
        ...state,
        queryPageSortBy: payload,
      }
    case PAGE_FILTER_CHANGED:
      return {
        ...state,
        queryPageFilter: payload,
      }
    case TOTAL_COUNT_CHANGED:
      return {
        ...state,
        totalCount: payload,
      }
    default:
      throw `Unhandled action type: ${type}`
  }
}
