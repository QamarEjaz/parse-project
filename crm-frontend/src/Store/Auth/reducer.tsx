import Parse from "parse";
import produce from "immer";
import { LOGIN_SUCCESS, LOGOUT } from "./actionTypes";
import { parseConfig } from "../../utils/ParseConfig";

parseConfig();

const initialState = {
  user: Parse.User.current() ? Parse.User.current() : null,
};

const Auth = produce((state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      state.user = Parse.User.current();
      break;
    case LOGOUT:
      state.user = null;
      Parse.User.logOut();
      break;
    default:
      break;
  }
}, initialState);

export default Auth;
