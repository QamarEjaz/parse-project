import * as types from "./actionTypes";

export const Login = (data) => {
  return {
    type: types.LOGIN,
    payload: data,
  };
};
export const LoginSuccess = (data) => {
  return {
    type: types.LOGIN_SUCCESS,
    payload: data,
  };
};

export const logout = () => {
  return {
    type: types.LOGOUT,
  };
};
