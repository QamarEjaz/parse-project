import Parse from "parse"
import { toast } from "react-toastify"
import { setPatientTableSubscription } from "../../../Store/Virtual/actions"

let retryCount = 0
const usePatientSubscription = (virtualPatientSubscription: any, queryClient: any, dispatch: any, queryKeys: string[]): void => {
  const fetchData = async (): Promise<any> => {
    try {
      const virtualQuery = new Parse.Query("VirtualCall")
      virtualQuery.notEqualTo("status", "ended")
      const virtualResponse = await virtualQuery.find()
      const appointmentIds = virtualResponse.map((queue: any) => queue?.attributes?.patient?.id)

      let response = new Parse.Query("PatientV1")
      response.containedIn("objectId", appointmentIds)
      const data = await response.subscribe()

      if (virtualPatientSubscription && virtualPatientSubscription?.unsubscribe) {
        // console.log("Virtual Table Patient Unsubscribe: ")
        virtualPatientSubscription?.unsubscribe()
        dispatch(setPatientTableSubscription(null))
      }

      dispatch(setPatientTableSubscription(data))

      data.on("close", () => {
        // console.log(`Virtual Table Patient Subscription closed ....`)
      })

      data.on("open", async () => {
        // console.log(`Virtual Table Patient Subscription opened`)
      })

      data.on("update", async (patient: any) => {
        // console.log(`Virtual Table Patient Subscription updated: `, patient, ", queryKey: ")
        queryKeys.map((queryKey) => {
          queryClient.setQueriesData([queryKey], (oldData: any): any => {
            oldData.results = oldData.results.map((queue: any) => {
              if (queue?.patient?.id === patient?.id) {
                queue.patient = patient
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

export default usePatientSubscription
