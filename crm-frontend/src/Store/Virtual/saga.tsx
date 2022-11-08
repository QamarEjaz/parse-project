import * as Parse from "parse"
import { fork, put, all, takeLatest } from "redux-saga/effects"
import * as types from "./actionTypes"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"
import { getPateintQueueSuccess, getSinglePatientQueueSuccess } from "./actions"

function* getPatientQueueRequest(): any {
  try {
    const VirtualCall = Parse.Object.extend("VirtualCall")
    const query = new Parse.Query(VirtualCall).include("patient").include(["appointment", "appointment.operatory", "appointment.location", "appointment.provider"])
    const results = yield query.find()
    yield put(getPateintQueueSuccess(results))
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* getSinglePatientQueueRequest(data: any): any {
  try {
    const response = yield Parse.Cloud.run("crmVirtualCallJoin", { virtualCallId: data.payload })
    console.log("response: ", response)
    yield put(getSinglePatientQueueSuccess(response))
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

// fix any
export function* watchGetPatientQueue(): any {
  yield takeLatest(types.GET_PATEINT_QUEUE, getPatientQueueRequest)
}
export function* watchGetSinglePatientQueue(): any {
  yield takeLatest(types.GET_SINGLE_PATIENT_QUEUE, getSinglePatientQueueRequest)
}
// fix any
export default function* virtualSaga(): any {
  yield all([fork(watchGetPatientQueue), fork(watchGetSinglePatientQueue)])
}
