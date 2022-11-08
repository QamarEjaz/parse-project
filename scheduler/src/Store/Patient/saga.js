import Parse from "parse";
// import { all, fork, put, takeLatest } from "redux-saga/effects"
import {
  REGISTER_PATIENT,
  GET_SELECTED_PATIENT,
  GET_WELCOME_CENTER_SCREEN,
} from "./actionTypes";
import { sagaErrorHandler } from "../../utils/SagaErrorHandler";
import { getSelectedPatientSuccess } from "./actions";
import { toast } from "react-toastify";
import { watchGetLocation } from "../Location/saga";

import { all, fork, takeLatest, put } from "redux-saga/effects";
// import { sagaErrorHandler } from "../../utils/SagaErrorHandler"

function* createPatientRequest({ payload }) {
  const {
    firstName,
    lastName,
    gender,
    emailAddress,
    phone,
    dateOfBirth,
    postalCode,
    setDateOfBirth,
    city,
    state,
    setPhoneNumber,
    address1,
    location,
    setIsLoading,
    resetFields,
    setSelectedLocation,
    defaultSelectedLocationValue,
    setShowCreatePatientComponent,
    setPatient
  } = payload;

  try {
    const patientResponse = yield Parse.Cloud.run("registerPatient", {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      emailAddress: emailAddress,
      phone: phone,
      dateOfBirth: dateOfBirth,
      postalCode: postalCode,
      address1: address1,
      city: city,
      state: state,
      preferredLocation: location,
    });
    if (patientResponse) {
      const patientData =  patientResponse.toJSON();
      setIsLoading(false);
      setDateOfBirth("");
      toast.success("Patient Created Successfullly");
      setSelectedLocation(defaultSelectedLocationValue);
      resetFields();
      setPhoneNumber("");
      setPatient(patientData);
      setShowCreatePatientComponent(false);
    }
    setShowCreatePatientComponent(false)
  } catch (error) {
    setIsLoading(false);
    setShowCreatePatientComponent(false)
    yield sagaErrorHandler(error);
  }
}
function* getSelectedPatientRequest({ payload }) {
  try {
    const query = new Parse.Query("PatientV1");
    query
      .include("preferredLocation")
      .include("preferredLocation.welcomeCenterLocation");
    const patient = yield query.get(payload);
    yield put(getSelectedPatientSuccess(patient.toJSON()));
  } catch (error) {
    yield sagaErrorHandler(error);
  }
}

function* getWelcomeCenterRequest({ payload }) {
  try {
    const query = new Parse.Query("PatientV1");
    query
      .include("preferredLocation")
      .include("preferredLocation.welcomeCenterLocation");
    const patient = yield query.get(payload.objectID);
    if (
      patient?.attributes?.preferredLocation.id ===
      patient.attributes?.preferredLocation?.attributes?.welcomeCenterLocation
        ?.id
    ) {
      payload.history.push("chooseDate");
    } else {
      payload.history.push("/welcomeCenterLocations");
    }
  } catch (error) {
    yield sagaErrorHandler(error);
  }
}

// export function* watchGetLocation() {
//   yield takeLatest(GET_LOCATION, getLocationRequest)
// }

export function* watchCreatePatient() {
  yield takeLatest(REGISTER_PATIENT, createPatientRequest);
}
// export function* watchGetSelectedPatient() {
//   yield takeLatest(GET_SELECTED_PATIENT, getSelectedPatientRequest)
// }
// export function* watchGetWelcomeCenterRequest() {
//   yield takeLatest(GET_WELCOME_CENTER_SCREEN, getWelcomeCenterRequest)
// }

export default function* PatientSaga() {
  yield all([
    fork(watchCreatePatient),
    // fork(watchGetSelectedPatient),
    // fork(watchGetWelcomeCenterRequest),
  ]);
}
