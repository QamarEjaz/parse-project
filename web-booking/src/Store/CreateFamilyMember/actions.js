import * as types from "./actionTypes";

export const AddFamilyMember = (data) => {
  return {
    type: types.ADD_FAMILY_MEMBER,
    payload: data,
  };
};

export const selectPatientSuccess = (data) => {
  return {
    type: types.SELECT_PATIENT_SUCCESS,
    payload: data,
  };
};

export const getFamilyMember = (data) => {
  return {
    type: types.GET_FAMILY_MEMBER,
    payload: data,
  };
};
export const getFamilyMemberSuccess = (data) => {
  return {
    type: types.GET_FAMILY_MEMBER_SUCCESS,
    payload: data,
  };
};

export const getFamilyMemberUpdatedlist = (data) => {
  return {
    type: types.GET_FAMILY_MEMBER_UPDATED_LIST,
    payload: data,
  };
};



