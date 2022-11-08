import * as types from "./actionTypes";

export const registerPatient = (data) => {
  return {
    type: types.REGISTER_PATIENT,
    payload: data,
  };
};
export const getLocation = (data) => {
  return {
    type: types.GET_LOCATION,
    payload: data,
  };
};
export const getLocationSuccess = (data) => {
  return {
    type: types.GET_LOCATIONS_SUCCESS,
    payload: data,
  };
};
export const selectedLocationSuccess = (data) => {
  return {
    type: types.SELECTED_LOCATION_SUCCESS,
    payload: data,
  };
};
export const getSelectedPatient = (data) => {
  return {
    type: types.GET_SELECTED_PATIENT,
    payload: data,
  };
};


export const getSelectedPatientSuccess = (data) => {
  return {
    type: types.GET_SELECTED_PATIENT_SUCCESS,
    payload: data,
  };
};
export const GetWelcomeCenterScreen = (data) => {
  return {
    type: types.GET_WELCOME_CENTER_SCREEN,
    payload: data,
  };
};
