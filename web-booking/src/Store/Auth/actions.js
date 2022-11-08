import * as types from "./actionTypes"

export const register = (data) => {
  return {
    type: types.REGISTER_USER,
    payload: data,
  }
}
export const registerSuccess = (data) => {
  return {
    type: types.REGISTER_USER_SUCCESS,
    payload: data,
  }
}

export const Login = (data) => {
  return {
    type: types.LOGIN,
    payload: data,
  }
}
export const LoginSuccess = (data) => {
  return {
    type: types.LOGIN_SUCCESS,
    payload: data,
  }
}

export const logout = () => {
  return {
    type: types.LOGOUT,
  }
}

export const getMainPatient = () => {
  return {
    type: types.GET_MAIN_PATIENT,
  }
}

export const getMainPatientSuccess = (data) => {
  return {
    type: types.GET_MAIN_PATIENT_SUCCESS,
    payload: data,
  }
}

export const getSelectedPatient = (data) => {
  return {
    type: types.GET_SELECTED_PATIENT,
    payload: data,
  }
}

export const getSelectedPatientSuccess = (data) => {
  return {
    type: types.GET_SELECTED_PATIENT_SUCCESS,
    payload: data,
  }
}

export const addAppointmentNote = (data) => {
  return {
    type: types.ADD_APPOINTMENT_NOTE,
    payload: data,
  }
}

export const getFormType = (data) => {
  return {
    type: types.GET_FORM_TYPE,
    payload: data,
  }
}

export const VerifyNumber = (data) => {
  return {
    type: types.VERIFY_NUMBER,
    payload: data,
  }
}

export const GetWelcomeCenterScreen = (data) => {
  return {
    type: types.GET_WELCOME_CENTER_SCREEN,
    payload: data,
  }
}

export const getSelectedPatientCard = (data) => {
  return {
    type: types.GET_SELECTED_PATIENT_CARD,
    payload: data,
  }
}

export const getSelectedPatientCardSuccess = (data) => {
  return {
    type: types.GET_SELECTED_PATIENT_CARD_SUCCESS,
    payload: data,
  }
}
