import Parse from "parse";
import { all, fork, put, takeLatest } from "redux-saga/effects";
import { LOGIN } from "./actionTypes";
import { sagaErrorHandler } from "../../utils/SagaErrorHandler";

import { LoginSuccess } from "./actions";

import axios from "axios";
axios.defaults.withCredentials = false;

function* loginRequest({ payload }) {
  const { setIsLoading } = payload;
  try {
    const user = yield Parse.User.logIn(payload.email, payload.password);
    yield put(LoginSuccess(Parse.User.current().toJSON()));
    setIsLoading(false);
    if (user) {
      payload.navigate("/");
    }
  } catch (error) {
    setIsLoading(false);
    yield sagaErrorHandler(error);
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN, loginRequest);
}

export default function* authSaga() {
  yield all([fork(watchLogin)]);
}
