import Parse from "parse"
import { toast } from "react-toastify"
import { setAppointmentTableSubscription } from "../../../Store/Virtual/actions"

const useAppointmentSubscription = (virtualAppointmentSubscription: any, queryClient: any, dispatch: any, queryKeys: string[]): void => {
  let retryCount = 0
  const fetchData = async (): Promise<any> => {
    try {
      const virtualQuery = new Parse.Query("VirtualCall")
      virtualQuery.notEqualTo("status", "ended")
      const virtualResponse = await virtualQuery.find()
      const appointmentIds = virtualResponse.map((queue: any) => queue?.attributes?.appointment?.id)

      let response = new Parse.Query("AppointmentV1")
      response.containedIn("objectId", appointmentIds)
      const data = await response.subscribe()

      if (virtualAppointmentSubscription && virtualAppointmentSubscription?.unsubscribe) {
        // console.log("Virtual Table Appointment Unsubscribe: ")
        virtualAppointmentSubscription?.unsubscribe()
        dispatch(setAppointmentTableSubscription(null))
      }

      dispatch(setAppointmentTableSubscription(data))

      data.on("close", () => {
        // console.log(`Virtual Table Appointment Subscription closed ....`)
      })

      data.on("open", async () => {
        // console.log(`Virtual Table Appointment Subscription opened`)
      })

      data.on("update", async (appointment: any) => {
        // console.log(`Virtual Table Appointment Subscription updated: `, appointment, ", queryKey: ")
        queryKeys.map((queryKey) => {
          queryClient.setQueriesData([queryKey], (oldData: any): any => {
            oldData.results = oldData.results.map((queue: any) => {
              if (queue?.appointment?.id === appointment?.id) {
                queue.appointment = appointment
                return queue
              }
              return queue
            })
            return oldData
          })
        })
      })
      return data
    } catch (err) {
      retryCount++
      if (retryCount !== 3) {
        setTimeout(function () {
          fetchData()
        }, 1000)
      } else {
        toast.warn("Refresh page to see the latest data.")
      }
    }
  }
  fetchData()
}

export default useAppointmentSubscription
