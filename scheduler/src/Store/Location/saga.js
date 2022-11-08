import Parse from "parse"
import { all, fork, put, takeLatest } from "redux-saga/effects"
import { GET_LOCATION } from "./actionTypes"
import { getLocationSuccess } from "./actions"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"

function* getLocationRequest({payload}) {
  try {
    if (payload !=null && !payload?.hasCompletedAppointment) {

      const response = new Parse.Query("LocationV1").equalTo("isActive", true).equalTo("isWelcomeCenter", true)
      const locations = yield response.findAll()
      yield put(
        getLocationSuccess(locations.map((location) => location.toJSON()))
      )
    } else {      
      const response = new Parse.Query("LocationV1")
      response.equalTo("isActive", true)
      const locations = yield response.findAll()
      yield put(
        getLocationSuccess(locations.map((location) => location.toJSON()))
      )
    }
  } catch (error) {
    yield sagaErrorHandler(error)
  }
}

export function* watchGetLocation() {
  yield takeLatest(GET_LOCATION, getLocationRequest)
}

export default function* LocationSaga() {
  yield all([fork(watchGetLocation)])
}
