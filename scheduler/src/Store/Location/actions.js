import * as types from "./actionTypes";

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
export const timeSlotAndLocationSuccess = (data) => {
  return {
    type: types.TIME_SLOT_AND_LOCATION,
    payload: data,
  };
};
