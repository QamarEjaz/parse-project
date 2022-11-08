import Parse from "parse"
import { all, fork, put, takeLatest } from "redux-saga/effects"
import { GET_LOCATION } from "./actionTypes"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"
import { getLocationSuccess } from "./actions"

function* getLocationRequest({ payload }) {
  try {
    const response = new Parse.Query("LocationV1")
    response.equalTo("isActive", true)
    const locations = yield response.findAll()
    yield put(
      getLocationSuccess(locations.map((location) => location.toJSON()))
    )
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
