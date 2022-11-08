import { all } from "redux-saga/effects";
import AppointmentSaga from "./Appointment/saga";
import authSaga from "./Auth/saga";
import LocationSaga from "./Location/saga";
import PatientSaga from "./Patient/saga";

export default function* rootSaga() {
  yield all([LocationSaga(), PatientSaga(), authSaga(), AppointmentSaga()]);
}
