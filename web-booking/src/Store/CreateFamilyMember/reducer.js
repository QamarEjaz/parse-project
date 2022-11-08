import produce from "immer";
import * as types from "./actionTypes";
import * as logout from "../Auth/actionTypes";

const INITIAL_STATE = {
  familyMember: null,
  selectedPatient: null,
  familyMemberList: false,
};

const FamilyMemberReducer = produce((state, action) => {
  switch (action.type) {
    case types.SELECT_PATIENT_SUCCESS:
      state.selectedPatient = action.payload;
      break;
    case types.GET_FAMILY_MEMBER_SUCCESS:
      state.familyMember = action.payload;
      break;
    case types.GET_FAMILY_MEMBER_UPDATED_LIST:
      state.familyMemberList = action.payload;
      break;
    case logout.LOGOUT:
      state.selectedPatient = null;
      state.familyMember = null;
      break;
    default:
  }
}, INITIAL_STATE);

export default FamilyMemberReducer;
