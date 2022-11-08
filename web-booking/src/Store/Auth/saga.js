import Parse from "parse"
import { all, fork, put, takeLatest } from "redux-saga/effects"
import {
  GET_MAIN_PATIENT,
  GET_SELECTED_PATIENT,
  GET_WELCOME_CENTER_SCREEN,
  LOGIN,
  REGISTER_USER,
  GET_SELECTED_PATIENT_CARD,
} from "../Auth/actionTypes"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"
import {
  getMainPatientSuccess,
  getSelectedPatientCardSuccess,
  getSelectedPatientSuccess,
  LoginSuccess,
  registerSuccess,
  VerifyNumber,
} from "./actions"

import axios from "axios"
axios.defaults.withCredentials = false

function* registerRequest({ payload }) {
  try {
    let data = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      reason: payload.note,
    }
    const username = yield Parse.Cloud.run("newBookingUser", data)
    yield put(registerSuccess(null))
    yield put(
      registerSuccess({
        username: username,
        phone: payload.phone,
        email: payload.email,
      })
    )
    payload.setIsLoading(false)
    payload.setVerifications(1)
  } catch (error) {
    payload.setIsLoading(false)
    yield sagaErrorHandler(error)
  }
}

function* loginRequest({ payload }) {
  try {
    yield Parse.User.logIn(payload.username, payload.password)
    yield put(LoginSuccess(Parse.User.current().toJSON()))

    const query = new Parse.Query("PatientV1")
    query.include("preferredLocation")
    const username = Parse.User.current().get("username")
    const patient = yield query.get(username)

    const patientData = patient.toJSON()
    yield put(getMainPatientSuccess(patientData))
    yield put(getSelectedPatientSuccess(patientData))
    yield put(VerifyNumber(true))

    // Log Attempt
    if (process.env.REACT_APP_SHEET_ATTEMPTS_PRODUCTION === "TRUE") {
      axios
        .post(`${process.env.REACT_APP_GOOGLE_SHEET_URL}/log/patient`, {
          brand: "THDC",
          origin: "Web App",
          type: patientData.hasCompletedAppointment ? "EXISTING" : "NEW",
          form: payload.formType == 1 ? "REGISTER" : "LOGIN",
          first_name: patientData.firstName,
          last_name: patientData.lastName,
          phone: patientData.phones?.length
            ? patientData.phones[0]?.number
            : "",
          email: patientData.emailAddress,
        })
        .then(() => console.log("Attempt Success"))
        .catch(() => console.log("Attempt Error"))
    }

    if (!patient.get("dateOfBirth") || !patient.get("gender")) {
      payload.history.push("/details")
    } else {
      payload.history.push("/patients")
    }
  } catch (error) {
    yield sagaErrorHandler(error)
  }
}

function* getMainPatientRequest() {
  try {
    if (Parse.User.current()) {
      yield Parse.User.current()?.fetch()
      yield put(LoginSuccess(Parse.User.current().toJSON()))
      const query = new Parse.Query("PatientV1")
      query
        .include("preferredLocation")
        .include("preferredLocation.welcomeCenterLocation")
      const patient = yield query.get(Parse.User.current().get("username"))
      yield put(getMainPatientSuccess(patient.toJSON()))
    }
  } catch (error) {
    yield sagaErrorHandler(error)
  }
}

function* getSelectedPatientRequest({ payload }) {
  try {
    const query = new Parse.Query("PatientV1")
    query
      .include("preferredLocation")
      .include("preferredLocation.welcomeCenterLocation")
    const patient = yield query.get(payload)
    yield put(getSelectedPatientSuccess(patient.toJSON()))
  } catch (error) {
    yield sagaErrorHandler(error)
  }
}

function* getWelcomeCenterRequest({ payload }) {
  try {
    const query = new Parse.Query("PatientV1")
    query
      .include("preferredLocation")
      .include("preferredLocation.welcomeCenterLocation")
    const patient = yield query.get(payload.objectID)
    if (
      patient?.attributes?.preferredLocation.id ===
      patient.attributes?.preferredLocation?.attributes?.welcomeCenterLocation
        ?.id
    ) {
      payload.history.push("chooseDate")
    } else {
      payload.history.push("/welcomeCenterLocations")
    }
  } catch (error) {
    yield sagaErrorHandler(error)
  }
}

function* getSelectedPatientCardRequest({ payload }) {
  const { mainPatient } = payload
  try {
    let response = yield Parse.Cloud.run("bookingPatientCardList", {
      patientId: mainPatient?.objectId,
    })
    yield put(
      getSelectedPatientCardSuccess(
        response?.map((cardList) => cardList.toJSON())
      )
    )
  } catch (error) {
    yield sagaErrorHandler(error)
  }
}

export function* watchRegister() {
  yield takeLatest(REGISTER_USER, registerRequest)
}
export function* watchLogin() {
  yield takeLatest(LOGIN, loginRequest)
}
export function* watchGetMainPatient() {
  yield takeLatest(GET_MAIN_PATIENT, getMainPatientRequest)
}
export function* watchGetSelectedPatient() {
  yield takeLatest(GET_SELECTED_PATIENT, getSelectedPatientRequest)
}
export function* watchGetWelcomeCenterRequest() {
  yield takeLatest(GET_WELCOME_CENTER_SCREEN, getWelcomeCenterRequest)
}
export function* watchGetSelectedPatientCard() {
  yield takeLatest(GET_SELECTED_PATIENT_CARD, getSelectedPatientCardRequest)
}

export default function* authSaga() {
  yield all([
    fork(watchRegister),
    fork(watchLogin),
    fork(watchGetMainPatient),
    fork(watchGetSelectedPatient),
    fork(watchGetWelcomeCenterRequest),
    fork(watchGetSelectedPatientCard),
  ])
}
