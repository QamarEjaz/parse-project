import * as types from "./actionTypes"

export const getPateintQueue = () => {
  return {
    type: types.GET_PATEINT_QUEUE,
  }
}
export const getSinglePatientQueue = (data: any) => {
  return {
    type: types.GET_SINGLE_PATIENT_QUEUE,
    payload: data,
  }
}

// fix any
export const getPateintQueueSuccess = (data: any) => {
  return {
    type: types.GET_PATEINT_QUEUE_SUCCESS,
    payload: data,
  }
}

export const getSinglePatientQueueSuccess = (data: any) => {
  return {
    type: types.GET_SINGLE_PATIENT_QUEUE_SUCCESS,
    payload: data,
  }
}
export const setVirtualTableSubscription = (data: any) => {
  return {
    type: types.SET_VIRTUAL_TABLE_SUBSCRIPTION,
    payload: data,
  }
}

export const setPatientTableSubscription = (data: any) => {
  return {
    type: types.SET_PEOPLE_TABLE_SUBSCRIPTION,
    payload: data,
  }
}

export const setAppointmentTableSubscription = (data: any) => {
  return {
    type: types.SET_APPOINTMENT_TABLE_SUBSCRIPTION,
    payload: data,
  }
}
