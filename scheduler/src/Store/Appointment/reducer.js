import Parse from "parse";
import produce from "immer";
import * as types from "./actionTypes";

const INITIAL_STATE = {
  appointmentNote: ""
};

const AppointmentReducer = produce((state, action) => {
  switch (action.type) {
    case types.ADD_APPOINTMENT_NOTE:
      state.appointmentNote = action.payload;
      break;
    default:
  }
}, INITIAL_STATE);

export default AppointmentReducer;
