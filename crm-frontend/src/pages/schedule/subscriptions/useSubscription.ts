import { useEffect } from "react"
import { useEffectOnce } from "../../../hooks/useEffectOnce"

let appointmentSubscription: any = null

const useSubscription = (addAppointment: any, updateAppointment: any, deleteAppointment: any, appointmentQuery: any, queryClient: any, date: any, location: any, providers: any, apptStatus: any): void => {

  useEffectOnce(() => {
    const runSubscription = async (): Promise<any> => {
      const subscription: any = await appointmentQuery.subscribe()

      if (appointmentSubscription && appointmentSubscription?.unsubscribe) {
        appointmentSubscription?.unsubscribe()
      }

      appointmentSubscription = subscription

      subscription?.on("close", () => {
        window.console.log("subscription closed ....")
      })
      subscription?.on("open", async () => {
        window.console.log("subscription opened")
      })
      subscription.on("create", async (appointment: any) => {
        window.console.log("Appointment Created: ", appointment, ", Appointment ID: ", appointment?.id, ", Patient ID: ", appointment.attributes?.patient?.id, ", Operatory ID: ", appointment.attributes?.operatory?.id)
      })

      subscription?.on("update", (appointment: any) => {
        window.console.log("Appointment Updated: ", appointment, ", Appointment ID: ", appointment?.id, ", Patient ID: ", appointment.attributes?.patient?.id, ", Operatory ID: ", appointment.attributes?.operatory?.id)

        const appt = appointment?.toJSON?.()
        deleteAppointment({ ...appt, start: appt?.start?.iso ? appt?.start?.iso : appt?.start, end: appt?.end?.iso }, queryClient, date, location, providers, apptStatus)
        addAppointment({ ...appt, start: appt?.start?.iso ? appt?.start?.iso : appt?.start, end: appt?.end?.iso }, queryClient, date, location, providers, apptStatus)
      })

      subscription?.on("delete", (appointment: any) => {
        window.console.log("Appointment Deleted: ", appointment, ", Appointment ID: ", appointment?.id)
        const appt = appointment?.toJSON?.()
        deleteAppointment({ ...appt, start: appt?.start?.iso ? appt?.start?.iso : appt?.start, end: appt?.end?.iso }, queryClient, date, location, providers, apptStatus)
      })
      subscription?.on("enter", async (appointment: any) => {
        window.console.log("Appointment entered: ", appointment, ", Appointment ID: ", appointment?.id, ", Patient ID: ", appointment.attributes?.patient?.id, ", Operatory ID: ", appointment.attributes?.operatory?.id)

        const appt = appointment?.toJSON?.()
        addAppointment({ ...appt, start: appt?.start?.iso ? appt?.start?.iso : appt?.start, end: appt?.end?.iso }, queryClient, date, location, providers, apptStatus)
      })

      subscription?.on("leave", (appointment: any) => {
        window.console.log("Appointment leaved: ", appointment, ", Appointment ID: ", appointment?.id)

        const appt = appointment?.toJSON?.()
        deleteAppointment({ ...appt, start: appt?.start?.iso ? appt?.start?.iso : appt?.start, end: appt?.end?.iso }, queryClient, date, location, providers, apptStatus)
      })
    }
    runSubscription()
  })

  useEffect(() => {
    return () => {
      if (appointmentSubscription && appointmentSubscription?.unsubscribe) {
        appointmentSubscription?.unsubscribe()
        appointmentSubscription = null
      }
    }
  },[])
}

export default useSubscription