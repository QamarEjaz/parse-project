import Parse from "parse";
import produce from "immer";
import * as types from "./actionTypes";

const INITIAL_STATE = {
  user: null,
};

const AuthReducer = produce((state, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      state.user = action.payload;
      break;
    case types.LOGOUT:
      Parse.User.logOut();
      state.user = null;
      break;
    default:
  }
}, INITIAL_STATE);

export default AuthReducer;
