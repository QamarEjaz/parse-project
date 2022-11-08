import { PhoneNumber, VerificationCode } from '../../Types/BookingTypes';
import { PHONE_NUMBER, VERIFICATION_CODE } from './actionTypes';

export const phoneNumberAction = (data: PhoneNumber) => {
  return {
    type: PHONE_NUMBER,
    payload: data,
  };
};

export const verificationCodeAction = (data: VerificationCode) => {
  return {
    type: VERIFICATION_CODE,
    payload: data,
  };
};
