import * as Parse from 'parse';
import { fork, put, all, takeLatest } from 'redux-saga/effects';
import { PHONE_NUMBER, VERIFICATION_CODE } from './actionTypes';
import { sagaErrorHandler } from '../../utils/SagaErrorHandler';
import { loginSuccess } from '../Auth/actions';

function* phoneNumberRequest({ payload }: any): any {
  const { setleftSidePenal, leftSidePenal, phone, setPhoneBtnDisable } =
    payload;
  try {
    setPhoneBtnDisable(true);
    const params = { username: phone };
    yield Parse.Cloud.run('SendOTP', params);
    setleftSidePenal(leftSidePenal + 1);
    setPhoneBtnDisable(false);
  } catch (error: any) {
    setPhoneBtnDisable(false);
    yield sagaErrorHandler(JSON.stringify(error.message));
  }
}

function* verificationCodeRequest({ payload }: any): any {
  const { username, password, setBtnDisable, history } = payload;
  try {
    setBtnDisable(true);
    yield Parse.User.logIn(username, password);
    setBtnDisable(false);
    history.push('/booking');
    yield put(loginSuccess());
  } catch (error: any) {
    setBtnDisable(false);
    yield sagaErrorHandler(JSON.stringify(error.message));
  }
}

export function* watchPhoneNumber() {
  yield takeLatest(PHONE_NUMBER, phoneNumberRequest);
}
export function* watchVerificationCode() {
  yield takeLatest(VERIFICATION_CODE, verificationCodeRequest);
}

export default function* bookingSaga() {
  yield all([fork(watchPhoneNumber), fork(watchVerificationCode)]);
}
