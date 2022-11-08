import produce from "immer";
import * as types from "./actionTypes";
// import * as logout from "../Auth/actionTypes";

const INITIAL_STATE = {
  locations: null,
  preferredLocation: null,
  timeSloteAndLocation: null,
  appointmentCreated: null,
};

const PatientReducer = produce((state, action) => {
  switch (action.type) {
    case types.GET_LOCATIONS_SUCCESS:
      state.locations = action.payload;
      break;
    case types.SELECTED_LOCATION_SUCCESS:
      state.preferredLocation = action.payload;
      break;
    case types.GET_SELECTED_PATIENT_SUCCESS:
        state.selectedPatient = action.payload;
      break;
    // case logout.LOGOUT:
    //   state.preferredLocation = null;
    //   state.locations = null;
    //   state.timeSloteAndLocation = null;
    //   break;
    default:
  }
}, INITIAL_STATE);

export default PatientReducer;
