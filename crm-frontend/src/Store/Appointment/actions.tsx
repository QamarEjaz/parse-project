import { IOption } from "../../components/Inputs/Select/Select.interfaces"
import * as types from "./actionTypes"

export const getLocation = () => {
  return {
    type: types.GET_LOCATION,
  }
}

export const getLocationSuccess = (data: any) => {
  return {
    type: types.GET_LOCATION_SUCCESS,
    payload: data,
  }
}

export const getProvider = () => {
  return {
    type: types.GET_PROVIDER,
  }
}

export const getProviderSuccess = (data: any) => {
  return {
    type: types.GET_PROVIDER_SUCCESS,
    payload: data,
  }
}

export const getOperatory = (data: any) => {
  return {
    type: types.GET_OPERATORY,
    payload: data,
  }
}

export const getOperatorySuccess = (data: any) => {
  return {
    type: types.GET_OPERATORY_SUCCESS,
    payload: data,
  }
}

export const getAppointment = (data: any) => {
  return {
    type: types.GET_APPOINTMENT,
    payload: data,
  }
}

export const getAppointmentSuccess = (data: any) => {
  return {
    type: types.GET_APPOINTMENT_SUCCESS,
    payload: data,
  }
}
export const addAppointmentSuccess = (data: any) => {
  return {
    type: types.ADD_APPOINTMENT_SUCCESS,
    payload: data,
  }
}
export const addAppointment = (data: any) => {
  return {
    type: types.ADD_APPOINTMENT,
    payload: data,
  }
}

export const updateLocalAppointment = (appt: any) => {
  return {
    type: types.UPDATE_LOCAL_APPOINTMENT,
    payload: appt,
  }
}

export const updateAppointment = (appt: any) => {
  return {
    type: types.UPDATE_APPOINTMENT,
    payload: appt,
  }
}
export const deleteAppointment = (appt: any) => {
  return {
    type: types.DELETE_APPOINTMENT,
    payload: appt,
  }
}
export const addLocalAppointment = (appt: any) => {
  return {
    type: types.ADD_LOCAL_APPOINTMENT,
    payload: appt,
  }
}
export const deleteLocalAppointment = (ascend_id: any) => {
  return {
    type: types.DELETE_LOCAL_APPOINTMENT,
    payload: ascend_id,
  }
}
export const appointmentSubscriptionSuccess = (ascend_id: any) => {
  return {
    type: types.APPOINTMENT_SUBSCRIPTION_SUCCESS,
    payload: ascend_id,
  }
}
export const updatePatientInAppts = (patient: any) => {
  return {
    type: types.UPDATE_PATIENT_IN_APPTS,
    payload: patient,
  }
}

export const setLocation = (location: IOption): { type: string; payload: IOption } => {
  return {
    type: types.SET_LOCATION,
    payload: location,
  }
}
