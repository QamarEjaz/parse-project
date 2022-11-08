import { all, fork } from "redux-saga/effects"
import AuthSaga from "./Auth/saga"
import BookingSaga from "./Booking/saga"
import AppointmentSaga from "./Appointment/saga"
import VirtualSaga from "./Virtual/saga"
import PeopleManagementSaga from "./PeopleManagement/saga"
import PatientSaga from "./Patient/saga"
import AutomationSaga from "./Automation/saga"

export function* rootSaga() {
  yield all([fork(AuthSaga), fork(BookingSaga), fork(AppointmentSaga), fork(VirtualSaga), fork(PeopleManagementSaga), fork(PatientSaga), fork(AutomationSaga)])
}
