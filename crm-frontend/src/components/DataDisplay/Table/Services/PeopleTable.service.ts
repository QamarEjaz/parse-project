import Parse from "parse"

const PeopleTableService = async ({
  queryClient,
  queryKey,
  queryPageIndex,
  queryPageSize,
  queryPageFilter,
  queryPageSortBy,
}: {
  queryClient: any
  queryKey: string
  queryPageIndex: number
  queryPageSize: number
  queryPageFilter: string
  queryPageSortBy: any[]
}): Promise<{
  count: number
  results: any[]
}> => {
  const response = new Parse.Query("User")

  if (queryPageFilter) {
    response.fullText("name", queryPageFilter)
  }
  if (queryPageSortBy?.length > 0) {
    queryPageSortBy.map((sort) => {
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
  try {
    const result: any = await response.find()
    const subscription = await response.subscribe()
    const getData = (person: any) => {
      return {
        name: person?.attributes["name"],
        username: person?.attributes["username"],
        status: person?.attributes["status"],
        createdAt: person?.attributes["createdAt"],
        delete: Function,
      }
    }

    subscription.on("close", () => {
      console.log("subscription closed ....")
    })

    subscription.on("open", async () => {
      console.log("subscription opened")
    })

    subscription.on("create", async (virtualQueue: any) => {
      console.log("subscription.on create: ", virtualQueue)
      queryClient.setQueriesData(queryKey, (oldData: any): any => {
        oldData.results = [...oldData.results, ...[getData(virtualQueue)]]
        oldData.count++
        return oldData
      })
    })

    subscription.on("update", async (virtualQueue: any) => {
      console.log("virtualQueue updated: ", virtualQueue)
      queryClient.setQueriesData([queryKey], (oldData: any): any => {
        oldData.results = oldData.results.map((people: any) => {
          if (people.id === virtualQueue.id) {
            return getData(virtualQueue)
          }
          return people
        })
        return oldData
      })
    })

    subscription.on("delete", async (virtualQueue: any) => {
      console.log("virtualQueue deleted", virtualQueue)
      queryClient.setQueriesData(queryKey, (oldData: any): any => {
        oldData.results = oldData.results.filter((appt: any) => appt.id !== virtualQueue.id)
        oldData.count--
        return oldData
      })
    })

    const results = result?.results?.map((person: any) => {
      return getData(person)
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

export default PeopleTableService
