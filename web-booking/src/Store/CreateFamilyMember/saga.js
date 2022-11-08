import Parse from "parse"
import { all, fork, put, takeLatest } from "redux-saga/effects"
import { ADD_FAMILY_MEMBER, GET_FAMILY_MEMBER } from "./actionTypes"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"
import moment from "moment"
import { getFamilyMemberSuccess, getFamilyMemberUpdatedlist } from "./actions"

function* addFamilyMemberRequest({ payload }) {
  const { firstName, lastName, email, phone, dateOfBirth, gender, user } =
    payload
  try {
    let data = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: email,
      phone: phone,
      optionalParams: {
        dateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
        gender: gender,
        primaryGuarantorId: user.username,
        isOwner: false,
      },
    }
    if (user.email !== email || user.phone !== phone) {
      data.optionalParams["primaryContactId"] = ""
    } else {
      data.optionalParams["primaryContactId"] = user.username
    }
    yield Parse.Cloud.run("addNewFamilyMember", data)
    yield put(getFamilyMemberSuccess([]))
    yield put(getFamilyMemberUpdatedlist(true))
    payload.history.push("/")
    // yield window.location.reload();
    yield payload.setIsLoading(false)
  } catch (error) {
    payload.setIsLoading(false)
    yield sagaErrorHandler(error)
  }
}

function* getFamilyMemberRequest({ payload }) {
  const { setPatientListLoader, mainPatient } = payload
  setPatientListLoader(true)
  try {
    let relatedPatientsData = yield Parse.Cloud.run("bookingPatientsList", {
      phone: mainPatient.phones?.length ? mainPatient.phones[0]?.number : "",
      email: mainPatient?.emailAddress,
    })
    yield put(
      getFamilyMemberSuccess(
        relatedPatientsData.map((relatedPatient) => relatedPatient.toJSON())
      )
    )
    yield put(getFamilyMemberUpdatedlist(false))
    setPatientListLoader(false)
  } catch (error) {
    setPatientListLoader(false)
    yield sagaErrorHandler(error)
  }
}

export function* watchAddFamilyMember() {
  yield takeLatest(ADD_FAMILY_MEMBER, addFamilyMemberRequest)
}
export function* watchGetFamilyMember() {
  yield takeLatest(GET_FAMILY_MEMBER, getFamilyMemberRequest)
}

export default function* FamilyMemberÇSaga() {
  yield all([fork(watchAddFamilyMember), fork(watchGetFamilyMember)])
}
