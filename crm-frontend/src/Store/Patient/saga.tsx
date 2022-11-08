import Parse from "parse"
import { fork, put, all, takeLatest } from "redux-saga/effects"
import { toast } from "react-toastify"
import * as types from "./actionTypes"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"
import { getPatientTypesSuccess } from "./actions"

function* registernewPatient({ payload }: any): any {
  const { firstName, lastName, gender, contactMethod, email, phone, languageType, patientStatus, dateOfBirth, postalCode, city, state, address, location, ssn, resetForm, primaryGuarantorId, setIsLoading, handleClose } = payload

  try {
    yield Parse.Cloud.run("registerPatient", {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      contactMethod: contactMethod,
      email: email,
      phone: phone,
      languageType: languageType,
      patientStatus: patientStatus,
      dateOfBirth: dateOfBirth,
      postalCode: postalCode,
      city: city,
      state: state,
      address1: address,
      preferredLocation: location,
      ssn: ssn,
      primaryGuarantorId: primaryGuarantorId,
      resetForm: resetForm,
      generatedBy: "crm",
      lastUpdatedBy: "crm",
    }).then(() => {
      toast.success("Patient Created Successfullly")
      setIsLoading(false)
      handleClose()
    })
  } catch (error: any) {
    setIsLoading(false)
    yield sagaErrorHandler(error)
  }
}

function* updatePatientInfo({ payload }: any): any {
  let { levelNeeds, socialHistory, patient, patientTypes, firstName, lastName, preferredName, emailAddress, gender, dateOfBirth, string, lastVisitDate, ssn, address1, city, state, postalCode, success } = payload

  try {
    const PatientV1 = Parse.Object.extend("PatientV1")
    const patientupdated = yield new PatientV1({
      id: patient?.id,
      patientTypes: patientTypes,
      levelNeeds: levelNeeds,
      socialHistory: socialHistory,
      lastUpdatedBy: "crm",
      generatedBy: "crm",
      firstName: firstName,
      lastName: lastName,
      preferredName: preferredName,
      emailAddress: emailAddress,
      gender: gender,
      dateOfBirth: dateOfBirth,
      patientStatus: lastVisitDate,
      firstVisitDate: lastVisitDate,
      lastVisitDate: lastVisitDate,
      ssn: ssn,
      address1: address1,
      city: city,
      state: state,
      postalCode: postalCode,
    })
    yield patientupdated.save().then(() => {
      toast.success("Patient Info Updated Successfullly")
      success(patientupdated)
    })
  } catch (error) {
    sagaErrorHandler(error)
  }
}

function* getPatientTypesRequest(): any {
  try {
    const response = new Parse.Query("PatientTypes")
    const result = yield response.findAll()
    yield put(getPatientTypesSuccess(result))
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}
function* uploadAttachmentRequest({ payload }: any): any {
  let { patient, profileImage, success, setIsSavingAppt } = payload

  try {
    const PatientV1 = Parse.Object.extend("PatientV1")
    const profile_picture: any = yield new PatientV1({
      id: patient?.id,
      profileImage: profileImage,
    })
    yield profile_picture.save().then(() => {
      toast.success("Picture Uploaded Successfullly")
      setIsSavingAppt(false)
      success(profileImage)
    })
  } catch (error) {
    sagaErrorHandler(error)
    setIsSavingAppt(false)
  }
}
export function* watchRegisterPatient() {
  yield takeLatest(types.REGISTER_PATIENT, registernewPatient)
}

export function* watchUpdatePatient() {
  yield takeLatest(types.UPDATE_PATIENT_INFO, updatePatientInfo)
}
export function* watchPatientTypes() {
  yield takeLatest(types.GET_PATIENT_TYPES, getPatientTypesRequest)
}
export function* watchUploadAttachment() {
  yield takeLatest(types.UPLOAD_ATTACHMENT, uploadAttachmentRequest)
}
export default function* patientSaga() {
  yield all([fork(watchRegisterPatient), fork(watchUpdatePatient), fork(watchPatientTypes), fork(watchUploadAttachment)])
}
