import Parse from "parse"
import { getQueryResponse } from "../Table.utils"

const VirtualWaitingService = async ({
  queryPageIndex,
  queryPageSize,
  queryPageFilter,
  queryPageSortBy,
}: {
  queryPageIndex: number
  queryPageSize: number
  queryPageFilter: string
  queryPageSortBy: any[]
}): Promise<{
  count: number
  results: any[]
}> => {
  const response = getQueryResponse({ Parse, queryPageFilter, queryPageSortBy, queryPageSize, queryPageIndex, queryTable: "VirtualCall", status: "waiting" })
  try {
    const result: any = await response.find()
    const getData = (appointment: any) => {
      return {
        id: appointment?.id,
        channelName: appointment?.attributes["channelName"],
        patient: appointment?.attributes["patient"],
        appointment: appointment?.attributes["appointment"],
        provider: appointment?.attributes["provider"],
        note: appointment?.attributes["appointment"].attributes["note"],
        chiefConcern: appointment?.attributes["appointment"].attributes["chiefConcern"],
        socialHistory: appointment?.attributes["patient"].attributes["socialHistory"],
        levelNeeds: appointment?.attributes["patient"].attributes["levelNeeds"],
        delete: Function,
      }
    }

    const results = result?.results
      ?.map((appointment: any) => {
        return getData(appointment)
      })
    const data = {
      count: result?.count,
      results,
    }

    return data
  } catch (e: any) {
    throw `API error:${e?.message}`
  }
}

export default VirtualWaitingService
