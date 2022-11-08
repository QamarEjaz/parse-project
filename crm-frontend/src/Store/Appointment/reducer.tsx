import produce from "immer"
import { IOption } from "../../components/Inputs/Select/Select.interfaces"
import * as types from "./actionTypes"

const initialState: {
  locations: any[]
  providers: any[]
  operatories: any[]
  appointments: any[]
  appointmentSubscription: any
  location: IOption
} = {
  locations: [],
  providers: [],
  operatories: [],
  appointments: [],
  appointmentSubscription: null,
  location: {
    id: "0",
    value: "",
    name: "Select",
  },
}

const Auth = produce((state, action) => {
  switch (action.type) {
    case types.GET_LOCATION_SUCCESS: {
      if (!state?.location.value) {
        const firstLocation = action?.payload?.[0]
        state.location = { id: firstLocation?.id, value: firstLocation?.id, name: firstLocation?.attributes?.name.replace("Total Health Dental Care ", "") }
      }
      state.locations = action.payload
      break
    }
    case types.GET_PROVIDER_SUCCESS:
      state.providers = action.payload
      break
    case types.GET_OPERATORY_SUCCESS:
      state.operatories = action.payload
      break
    case types.GET_APPOINTMENT_SUCCESS:
      state.appointments = action.payload
      break
    case types.ADD_APPOINTMENT_SUCCESS: {
      state.appointments = [...state.appointments, action.payload]
      break
    }
    case types.UPDATE_PATIENT_IN_APPTS: {
      const updatedAppointments: any[] = state.appointments.map((appt: any) => {
        if (action?.payload?.id === appt?.attributes?.patient?.id) {
          return { ...appt, attributes: { ...appt?.attributes, patient: { ...appt?.attributes?.patient, attributes: { ...appt?.attributes?.patient?.attributes, ...action?.payload } } } }
        }
        return appt
      })
      state.appointments = updatedAppointments
      break
    }
    case types.UPDATE_LOCAL_APPOINTMENT: {
      const updatedAppointments: any[] = state.appointments.map((appt: any) => {
        if (action?.payload?.id === appt?.id) {
          return action.payload
        }
        return appt
      })
      state.appointments = updatedAppointments
      break
    }
    case types.ADD_LOCAL_APPOINTMENT: {
      let found = false
      const updatedAppointments: any[] = state.appointments.map((appt: any) => {
        if (action?.payload?.id === appt?.id) {
          found = true
          return action.payload
        }
        return appt
      })
      state.appointments = updatedAppointments
      if (!found) state.appointments = [...state.appointments, action.payload]
      break
    }
    case types.DELETE_LOCAL_APPOINTMENT: {
      state.appointments = state.appointments.filter((appt: any) => {
        return appt?.id !== action.payload.id
      })
      break
    }
    case types.APPOINTMENT_SUBSCRIPTION_SUCCESS: {
      if (state.appointmentSubscription && state?.appointmentSubscription?.unsubscribe) {
        state?.appointmentSubscription?.unsubscribe()
      }
      state.appointmentSubscription = action.payload
      break
    }
    case types.SET_LOCATION: {
      state.location = action.payload
      break
    }
    default:
      break
  }
}, initialState)

export default Auth
