import produce from "immer";
import * as types from "./actionTypes";
import * as logout from "../Auth/actionTypes";

const INITIAL_STATE = {
  personelInfo: null,
};

const PersonalInfoReducer = produce((state, action) => {
  switch (action.type) {
    case types.ADD_PERSONAL_INFO_SUCCESS:
      state.personelInfo = action.payload;
      break;
    case logout.LOGOUT:
      state.personelInfo = null;
      break;
    default:
  }
}, INITIAL_STATE);

export default PersonalInfoReducer;
