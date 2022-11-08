import Parse from "parse";
import { all, fork, takeLatest, put } from "redux-saga/effects";
import { toast } from "react-toastify";
import { CREATE_PATIENT_APPOINTMENT } from "./actionTypes";
import { sagaErrorHandler } from "../../utils/SagaErrorHandler";

function* createAppointmentRequest({ payload }) {
  const {
    patientId,
    locationId,
    date,
    start,
    generatedBy,
    note,
    setLoading,
    handleDiscard,
  } = payload;

  try {
    yield Parse.Cloud.run("bookingAppointmentCreate", {
      patientId: patientId,
      locationId: locationId,
      date: date,
      start: start,
      generatedBy: generatedBy,
      note: note,
    });
    toast.success("Appointment Created Successfullly");
    handleDiscard();
    setLoading(false);
  } catch (error) {
    setLoading(false);
    yield sagaErrorHandler(error);
  }
}

export function* watchCreateAppointment() {
  yield takeLatest(CREATE_PATIENT_APPOINTMENT, createAppointmentRequest);
}

export default function* AppointmentSaga() {
  yield all([fork(watchCreateAppointment)]);
}
