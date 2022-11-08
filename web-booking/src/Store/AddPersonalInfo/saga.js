import Parse from "parse"
import { all, fork, put, takeLatest } from "redux-saga/effects"
import { ADD_PERSONAL_INFO } from "./actionTypes"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"
import { getSelectedPatientSuccess } from "../Auth/actions"

function* addPersonalInfoRequest({ payload }) {
  const {
    emailAddress,
    dateOfBirth,
    gender,
    user,
    address,
    city,
    state,
    postalCode,
  } = payload
  try {
    const PatientV1 = Parse.Object.extend("PatientV1")
    const patient = new PatientV1({
      id: user.username,
      dateOfBirth: dateOfBirth,
      emailAddress: emailAddress,
      gender: gender,
      address1: address,
      city: city,
      state: state,
      postalCode: postalCode,
    })
    yield patient.save()
    yield put(getSelectedPatientSuccess(patient.toJSON()))
  } catch (error) {
    yield sagaErrorHandler(error)
  }
}

export function* watchAddPersonalInfo() {
  yield takeLatest(ADD_PERSONAL_INFO, addPersonalInfoRequest)
}

export default function* PersonalInfoSaga() {
  yield all([fork(watchAddPersonalInfo)])
}
