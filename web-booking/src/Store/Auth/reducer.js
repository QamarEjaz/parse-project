import Parse from "parse";
import produce from "immer";
import * as types from "./actionTypes";

const INITIAL_STATE = {
  user: null,
  mainPatient: null,
  selectedPatient: null,
  appointmentNote: "",
  formType: "",
  verifyNumber: false,
  selectedPatientCard: []
};

const AuthReducer = produce((state, action) => {
  switch (action.type) {
    case types.REGISTER_USER_SUCCESS:
      state.user = action.payload;
      break;
    case types.LOGIN_SUCCESS:
      state.user = action.payload;
      break;
    case types.GET_SELECTED_PATIENT_SUCCESS:
      state.selectedPatient = action.payload;
      break;
    case types.GET_MAIN_PATIENT_SUCCESS:
      state.mainPatient = action.payload;
      break;
    case types.ADD_APPOINTMENT_NOTE:
      state.appointmentNote = action.payload;
      break;
    case types.GET_FORM_TYPE:
      state.formType = action.payload;
      break;
    case types.VERIFY_NUMBER:
      state.verifyNumber = action.payload;
      break;
    case types.GET_SELECTED_PATIENT_CARD_SUCCESS:
      state.selectedPatientCard = action.payload;
      break;
    case types.LOGOUT:
      Parse.User.logOut();
      state.user = null;
      state.selectedPatient = null;
      state.mainPatient = null;
      state.appointmentNote = "";
      state.formType = "";
      state.verifyNumber = false;
      state.selectedPatientCard = [];
      break;
    default:
  }
}, INITIAL_STATE);

export default AuthReducer;
