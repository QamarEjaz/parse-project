import Parse from "parse"
import { fork, put, all, takeLatest } from "redux-saga/effects"
import { toast } from "react-toastify"
import { LOGIN, REGISTER_USER } from "./actionTypes"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"
import { loginSuccess } from "./actions"

function* loginUser({ payload }: any): any {
  const { email, password, resetForm, setBtnDisable, navigate } = payload
  try {
    setBtnDisable(true)
    yield Parse.User.logIn(email, password)
    toast.success("Login successfull")
    setBtnDisable(false)
    navigate("/people-management")
    resetForm()
    yield put(loginSuccess())
  } catch (error: any) {
    setBtnDisable(false)
    yield sagaErrorHandler(error)
  }
}

function* registerUser({ payload }: any): any {
  const { name, email, password, resetForm, navigate, setBtnDisable } = payload
  try {
    setBtnDisable(true)
    yield Parse.Cloud.run("signup", {
      name: name,
      email: email,
      password: password,
    })
    resetForm()
    setBtnDisable(false)
    toast.success("User registered successfully")
    navigate("/crm")
  } catch (error: any) {
    setBtnDisable(false)
    yield sagaErrorHandler(error)
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN, loginUser)
}
export function* watchRegister() {
  yield takeLatest(REGISTER_USER, registerUser)
}

export default function* authSaga() {
  yield all([fork(watchLogin), fork(watchRegister)])
}
