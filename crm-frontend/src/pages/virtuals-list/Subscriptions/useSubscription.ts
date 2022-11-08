import { useEffect, useRef } from "react"
import Parse from "parse"
import { useQueryClient } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import { setVirtualTableSubscription } from "../../../Store/Virtual/actions"
import { useEffectOnce } from "../../../hooks/useEffectOnce"
import { toast } from "react-toastify"

const useSubscription = (): void => {
  let virtualTableSubcscription = useSelector((state: any) => state?.Virtual.virtualTableSubcscription)
  const retryCountRef = useRef(0)

  /**
   * Subscription queries for Virtual Table
   */
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  useEffectOnce(() => {
    const fetchData = async (): Promise<any> => {
      try {
        const response = new Parse.Query("VirtualCall")
        response.include(["patient", "appointment", "appointment.operatory", "appointment.provider", "appointment.location"])
        const data = await response.subscribe()
        dispatch(setVirtualTableSubscription(data))
        const getData = (appointment: any): any => {
          return {
            id: appointment?.id,
            channelName: appointment?.attributes["channelName"],
            patient: appointment?.attributes["patient"],
            appointment: appointment?.attributes["appointment"],
            provider: appointment?.attributes["provider"],
            note: appointment?.attributes["appointment"].attributes["note"],
            socialHistory: appointment?.attributes["patient"].attributes["socialHistory"],
            levelNeeds: appointment?.attributes["patient"].attributes["levelNeeds"],
            delete: Function,
          }
        }
  
        data.on("close", () => {
          console.log("Virtual Table Subscription closed ....")
        })
  
        data.on("open", async () => {
          console.log("Virtual Table Subscription opened")
        })
  
        data.on("create", async (virtualQueue: any) => {
          await virtualQueue.get("patient").fetch()
          await virtualQueue.get("appointment").fetch()
          await virtualQueue.get("appointment").get("operatory").fetch()
          await virtualQueue.get("appointment").get("provider").fetch()
          await virtualQueue.get("appointment").get("location").fetch()
          console.log("Virtual Table Subscription Create: ", virtualQueue)
          queryClient.setQueriesData([`virtual-${virtualQueue.attributes.status}`], (oldData: any): any => {
            if (!oldData.results.find((queue: any) => queue.id === virtualQueue.id)) {
              oldData.results = [...oldData.results, ...[getData(virtualQueue)]]
              oldData.count++
            }
            return oldData
          })
        })
  
        data.on("update", async (virtualQueue: any) => {
          await virtualQueue.get("patient").fetch()
          await virtualQueue.get("appointment").fetch()
          await virtualQueue.get("appointment").get("operatory").fetch()
          await virtualQueue.get("appointment").get("provider").fetch()
          await virtualQueue.get("appointment").get("location").fetch()
          console.log("Virtual Table Subscription Updated: ", virtualQueue, ", queryKey: ", `virtual-${virtualQueue.attributes.status}`)
          const keys = ["virtual-waiting", "virtual-upcoming", "virtual-active"]
          keys.map((key: any) => {
            queryClient.setQueriesData([key], (oldData: any): any => {
              let data = {...oldData}
              data.results = data.results.filter((queue: any) => {
                if (queue.id !== virtualQueue.id) {
                  return queue
                } else {
                  data.count--
                }
              })
              return data
            })
            queryClient.setQueriesData([key], (oldData: any): any => {
              console.log(`oldData-${key}`, oldData)
            })
          })
          keys.map((key: any) => {
            queryClient.setQueriesData([key], (oldData: any): any => {
              let data = {...oldData}
              if (key === `virtual-${virtualQueue.attributes.status}` && virtualQueue.attributes.status !== "ended") {
                data.results.push(getData(virtualQueue))
                data.count++
              }
              return data
            })
            queryClient.setQueriesData([key], (oldData: any): any => {
              console.log(`oldData-${key}`, oldData)
            })
          })
        })
  
        data.on("delete", async (virtualQueue: any) => {
          console.log("Virtual Table Subscription Deleted", virtualQueue)
          queryClient.setQueriesData([`virtual-${virtualQueue.attributes.status}`], (oldData: any): any => {
            oldData.results = oldData.results.filter((appt: any) => appt.id !== virtualQueue.id)
            oldData.count--
            return oldData
          })
          queryClient.setQueriesData([`virtual-${virtualQueue.attributes.status}`], (oldData: any): any => {
            console.log(`oldData-${virtualQueue.attributes.status}`, oldData)
          })
        })

        return data
      } catch (err) {
        retryCountRef.current++
        if(retryCountRef.current !== 3) {
          setTimeout(function () {
            fetchData()
          }, 1000)
        } else {
          toast.warn("Refresh page to see the latest data.")
        }
      }
    }
    fetchData()
  })

  useEffect(() => {
    return () => {
      if (virtualTableSubcscription && virtualTableSubcscription?.unsubscribe) {
        // console.log("Virtual Table Unsubscribe: ")
        virtualTableSubcscription?.unsubscribe()
        dispatch(setVirtualTableSubscription(null))
      }
    }
  }, [virtualTableSubcscription])
}

export default useSubscription
