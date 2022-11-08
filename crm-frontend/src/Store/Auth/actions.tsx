import { LoginData, SignupData } from '../../Types/AuthTypes';
import { LOGIN, REGISTER_USER, LOGOUT, LOGIN_SUCCESS } from './actionTypes';

export const loginUser = (data: LoginData) => {
  return {
    type: LOGIN,
    payload: data,
  };
};

export const loginSuccess = () => {
  return {
    type: LOGIN_SUCCESS,
  };
};

export const registerUser = (data: SignupData) => {
  return {
    type: REGISTER_USER,
    payload: data,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};
