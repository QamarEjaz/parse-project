import * as types from "./actionTypes";

export const addAppointmentNote = (data) => {
  return {
    type: types.ADD_APPOINTMENT_NOTE,
    payload: data,
  };
};

export const CreatePatientAppointment = (data) => {
  return {
    type: types.CREATE_PATIENT_APPOINTMENT,
    payload: data,
  };
};
