import * as types from "./actionTypes";

export const AddPersonalInfo = (data) => {
  return {
    type: types.ADD_PERSONAL_INFO,
    payload: data,
  };
};
export const AddPersonalInfoSuccess = (data) => {
  return {
    type: types.ADD_PERSONAL_INFO_SUCCESS,
    payload: data,
  };
};
