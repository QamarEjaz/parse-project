import * as Parse from "parse"
import { fork, put, all, takeLatest } from "redux-saga/effects"
import * as types from "./actionTypes"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"
import { OPERATORY_WHITELIST, APPOINTMENT_WHITELIST } from "../../constants/Whitelists"
import { getLocationSuccess, getOperatorySuccess, getProviderSuccess, getAppointmentSuccess, addAppointmentSuccess, addAppointment, updateAppointment, updateLocalAppointment, appointmentSubscriptionSuccess, deleteLocalAppointment } from "./actions"
import moment from "moment"
import { toast } from "react-toastify"
import { excludeParseQueryFields, formatDate } from "../../utils/helpers"
import { I_User } from "../../../../core/src/models/_User"

function* getLocationRequest(): any {
  try {
    const response = new Parse.Query("LocationV1")
    const result = yield response.findAll()
    yield put(getLocationSuccess(result))
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* getProvidersRequest(): any {
  try {
    const response = new Parse.Query("ProviderV1").equalTo("active", true)
    const result = yield response.findAll()
    yield put(getProviderSuccess(result))
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* getOperatoryRequest({ payload }: any): any {
  const { location } = payload
  if (!location?.value) return
  try {
    const response = Parse.Object.extend("OperatoryV1")
    const query = new Parse.Query(response)

    /**
     * Exclude unnecessary fields from query.
     */
    excludeParseQueryFields({ query: query, whitelist: OPERATORY_WHITELIST })

    /**
     * Apply Filters
     */
    query.equalTo("location", location.value)

    const result = yield query.find()
    yield put(getOperatorySuccess(result))
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* getAppointmentsRequest({ payload }: any): any {
  const { location, status, providers, date, setAppointmentsFetched, setAppointments, updateAppointment, addAppointment, deleteAppointment } = payload

  if (!location?.value) return

  try {
    const PatientV1 = Parse.Object.extend("PatientV1")
    const LocationV1 = Parse.Object.extend("LocationV1")

    const start = moment(date).startOf("day") // Start of day
    const end = moment(date).endOf("day") // End of day

    const appointmentQuery = new Parse.Query("AppointmentV1")

    /**
     * Exclude unnecessary fields from query.
     */
    excludeParseQueryFields({
      query: appointmentQuery,
      whitelist: APPOINTMENT_WHITELIST,
    })

    appointmentQuery.notEqualTo("ascendSyncCompleted", false)
    appointmentQuery.include(["patient", "teamMembers"]) // Include patient and teamMembers object in each appoitnment

    appointmentQuery.equalTo("location", new LocationV1({ id: location.value }))
    appointmentQuery.greaterThanOrEqualTo("start", start.format())
    appointmentQuery.lessThan("start", end.format())

    if (providers.length) {
      appointmentQuery.containedIn(
        "provider",
        providers.map((p: any) => p?.value)
      )
    }
    if (status.length) {
      appointmentQuery.containedIn(
        "status",
        status.map((s: any) => s?.value?.toUpperCase?.())
      )
    }

    const subscription = yield appointmentQuery.subscribe()

    yield put(appointmentSubscriptionSuccess(subscription))

    appointmentQuery.find().then((result) => {
      setAppointmentsFetched(true)
      setAppointments(result)
    })

    subscription.on("close", () => {
      console.log("Schedule Page Subscription Close ....")
    })

    subscription.on("open", async () => {
      console.log("Schedule Page Subscription Open ....")
    })

    subscription.on("create", async (appointment: any) => {
      console.log("Schedule Page Subscription Create: ", appointment, ", Appointment ID: ", appointment?.id, ", Patient ID: ", appointment.attributes?.patient?.id, ", Operatory ID: ", appointment.attributes?.operatory?.id)
    })

    subscription.on("update", (appointment: any) => {
      console.log("Schedule Page Subscription Update: ", appointment, ", Appointment ID: ", appointment?.id, ", Patient ID: ", appointment.attributes?.patient?.id, ", Operatory ID: ", appointment.attributes?.operatory?.id)
      deleteLocalAppointment(appointment?.id)
      addAppointment(appointment)
    })

    subscription.on("delete", (appointment: any) => {
      console.log("Schedule Page Subscription Delete: ", appointment, ", Appointment ID: ", appointment?.id)
      deleteAppointment(appointment?.id)
    })
    subscription.on("enter", async (appointment: any) => {
      console.log("Schedule Page Subscription Enter: ", appointment, ", Appointment ID: ", appointment?.id, ", Patient ID: ", appointment.attributes?.patient?.id, ", Operatory ID: ", appointment.attributes?.operatory?.id)
      addAppointment(appointment)
    })

    subscription.on("leave", (appointment: any) => {
      console.log("Schedule Page Subscription Leave: ", appointment, ", Appointment ID: ", appointment?.id)
      deleteAppointment(appointment?.id)
    })
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}
function* addAppointmentRequest({ payload }: any): Generator<any, any, unknown> {
  // Required params
  let { status, other, operatory, provider, date, start, end, notes, patient, location, chiefConcern, teamMembers, callback } = payload

  const fdate = formatDate(date, "YYYY-MM-DD")
  const completeStartDate = new Date(`${fdate} ${moment(start.value, ["h:mmA"]).format("HH:mm")}`)
  const completeEndDate = new Date(`${fdate} ${moment(end.value, ["h:mmA"]).format("HH:mm")}`)

  try {
    const AppointmentV1 = Parse.Object.extend("AppointmentV1")
    const PatientV1 = Parse.Object.extend("PatientV1")
    const ProviderV1 = Parse.Object.extend("ProviderV1")
    const OperatoryV1 = Parse.Object.extend("OperatoryV1")
    const LocationV1 = Parse.Object.extend("LocationV1")
    const _User = Parse.Object.extend("_User")
    const appointment = new AppointmentV1()
    let teamPointers: any = []

    if (patient?.id) {
      let patientQuery = new Parse.Query(PatientV1)

      let patientObject = yield patientQuery.get(`${patient?.id}`)
      appointment.set("patient", patientObject)
    }

    if (provider?.value) {
      let providerQuery = new Parse.Query(ProviderV1)

      let providerObject = yield providerQuery.get(`${provider?.value}`)
      appointment.set("provider", providerObject)
    }

    if (operatory?.value) {
      let operatoryQuery = new Parse.Query(OperatoryV1)

      let operatoryObject = yield operatoryQuery.get(`${operatory?.value}`)
      appointment.set("operatory", operatoryObject)
    }

    if (location?.value) {
      let locationQuery = new Parse.Query(LocationV1)

      let locationObject = yield locationQuery.get(`${location?.value}`)
      appointment.set("location", locationObject)
    }

    appointment.set("start", completeStartDate)
    appointment.set("end", completeEndDate)
    appointment.set("status", status?.value)
    appointment.set("other", other)
    appointment.set("note", notes)
    appointment.set("generatedBy", "crm")
    appointment.set("lastUpdatedBy", "crm")

    appointment.set("chiefConcern", chiefConcern)
    if (teamMembers && teamMembers.length > 0) {
      teamMembers.map((memberId: string) => {
        const user = new _User({} as I_User)
        user.id = memberId
        teamPointers.push(user.toPointer())
      })
      appointment.set("teamMembers", teamPointers)
    }

    yield appointment.save().then(
      () => {
        toast.success("Appointment Created Successfully")
        callback()
      },
      (error: any) => {
        sagaErrorHandler(error)
      }
    )
  } catch (error) {
    sagaErrorHandler(error)
    callback()
  }
}
function* updateAppointmentRequest({ payload }: any): Generator<any, any, unknown> {
  // Required params
  let { status, other, operatory, provider, date, start, end, notes, patient, location, callback, id, chiefConcern, teamMembers } = payload
  const fdate = formatDate(date, "YYYY-MM-DD")
  const completeStartDate = new Date(`${fdate} ${moment(start.value, ["h:mmA"]).format("HH:mm")}`)
  const completeEndDate = new Date(`${fdate} ${moment(end.value, ["h:mmA"]).format("HH:mm")}`)

  try {
    const AppointmentV1 = Parse.Object.extend("AppointmentV1")
    const PatientV1 = Parse.Object.extend("PatientV1")
    const ProviderV1 = Parse.Object.extend("ProviderV1")
    const OperatoryV1 = Parse.Object.extend("OperatoryV1")
    const LocationV1 = Parse.Object.extend("LocationV1")
    const _User = Parse.Object.extend("_User")
    const query = new Parse.Query(AppointmentV1)
    const appointment: any = yield query.get(id)
    let teamPointers: any = []

    if (patient?.id) {
      let patientQuery = new Parse.Query(PatientV1)

      let patientObject = yield patientQuery.get(`${patient?.id}`)
      appointment.set("patient", patientObject)
    }

    if (provider?.value) {
      let providerQuery = new Parse.Query(ProviderV1)

      let providerObject = yield providerQuery.get(`${provider?.value}`)
      appointment.set("provider", providerObject)
    }

    if (operatory?.value) {
      let operatoryQuery = new Parse.Query(OperatoryV1)

      let operatoryObject = yield operatoryQuery.get(`${operatory?.value}`)
      appointment.set("operatory", operatoryObject)
    }

    if (location?.value) {
      let locationQuery = new Parse.Query(LocationV1)

      let locationObject = yield locationQuery.get(`${location?.value}`)
      appointment.set("location", locationObject)
    }
    appointment.set("start", completeStartDate)
    appointment.set("end", completeEndDate)
    appointment.set("status", status?.value)
    appointment.set("other", other)
    appointment.set("note", notes)
    appointment.set("lastUpdatedBy", "crm")

    appointment.set("chiefConcern", chiefConcern)
    if (teamMembers && teamMembers.length > 0) {
      teamMembers.map((memberId: string) => {
        const user = new _User({} as I_User)
        user.id = memberId
        teamPointers.push(user.toPointer())
      })
      appointment.set("teamMembers", teamPointers)
    }

    yield appointment.save().then(
      () => {
        toast.success("Appointment Updated Successfully")
        callback()
      },
      (error: any) => {
        sagaErrorHandler(error)
      }
    )
  } catch (error) {
    sagaErrorHandler(error)
    callback()
  }
}
function* deleteAppointmentRequest({ payload }: any): Generator<any, any, unknown> {
  let { id, callback } = payload
  try {
    const AppointmentV1 = Parse.Object.extend("AppointmentV1")
    const query = new Parse.Query(AppointmentV1)

    yield query.get(id).then(
      async (appt: any) => {
        await appt.destroy({})
        toast.success("Appointment Deleted Successfully")
        callback()
      },
      (error) => {
        sagaErrorHandler(error)
        callback()
      }
    )
  } catch (error) {
    sagaErrorHandler(error)
    callback()
  }
}

export function* watchGetLocation() {
  yield takeLatest(types.GET_LOCATION, getLocationRequest)
}
export function* watchGetProviders() {
  yield takeLatest(types.GET_PROVIDER, getProvidersRequest)
}
export function* watchGetOperatory() {
  yield takeLatest(types.GET_OPERATORY, getOperatoryRequest)
}
export function* watchGetAppointments() {
  yield takeLatest(types.GET_APPOINTMENT, getAppointmentsRequest)
}
export function* watchAddAppointment() {
  yield takeLatest(types.ADD_APPOINTMENT, addAppointmentRequest)
}
export function* watchUpdateAppointment() {
  yield takeLatest(types.UPDATE_APPOINTMENT, updateAppointmentRequest)
}

export function* watchDeleteAppointment() {
  yield takeLatest(types.DELETE_APPOINTMENT, deleteAppointmentRequest)
}
export default function* appointmentSaga() {
  yield all([fork(watchGetLocation), fork(watchGetProviders), fork(watchGetOperatory), fork(watchGetAppointments), fork(watchAddAppointment), fork(watchUpdateAppointment), fork(watchDeleteAppointment)])
}
