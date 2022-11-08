import * as Parse from "parse"
import { fork, put, all, takeLatest } from "redux-saga/effects"
import * as types from "./actionTypes"
import { getAllPeopleSuccess, getPeopleSetSuccess } from "./actions"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"
import moment from "moment"
import { toast } from "react-toastify"

function* getAllPeopleRequest({ payload }: any): any {
  const { tableList, setTableList, allPeopleSkips, search } = payload
  try {
    const response = new Parse.Query("User")
    response.withCount()
    response.skip(100 * (allPeopleSkips - 1))
    response.limit(100)
    if (search) response.fullText("name", search)
    const result = yield response.find()
    if (search) {
      setTableList([...result.results])
    } else {
      setTableList([...tableList, ...result.results])
    }
    yield put(getAllPeopleSuccess(result))
  } catch (error: any) {}
}

function* getPeopleSetRequest({ payload }: any): any {
  const { peoplesettableList, setPeopleSetTableList, peopleSetSkips, search } = payload
  try {
    const response = new Parse.Query("PeopleSet")
    response.withCount()
    response.skip(100 * (peopleSetSkips - 1))
    response.limit(10)
    if (search) response.fullText("username", search)
    const result = yield response.find()
    if (search) {
      setPeopleSetTableList([...result.results])
    } else {
      setPeopleSetTableList([...peoplesettableList, ...result.results])
    }

    yield put(getPeopleSetSuccess(result))
  } catch (error: any) {}
}

function* addPeopleRequest({ payload }: any): any {
  const { username, email, phone1, startDate, peopleSets, departments, managers, setLoading, resetForm, name, status } = payload

  try {
    setLoading(true)
    let People = Parse.Object.extend("User")
    let people = new People()
    people.set("username", username)
    people.set("name", name)
    people.set("email", email)
    people.set("phone1", phone1)
    people.set("peopleSets", peopleSets)
    const myDate = moment(startDate, "YYYY-MM-DD").toDate()
    people.set("startDate", myDate)
    people.set("password", "Drh@randompass")
    people.set("generatedBy", "crm")
    people.set("lastUpdatedBy", "crm")
    people.set("status", status || "New")
    yield people.save(null, { context: payload })
    setLoading(false)
    toast.success("Person added successfully!")
    resetForm()
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* addPeopleSetRequest({ payload }: any): any {
  const {
    name,
    // features,
    // locations,
    // departments,
    setLoading,
    // resetForm,
  } = payload

  try {
    setLoading(true)
    let PeopleSet = Parse.Object.extend("PeopleSet")
    let addPeopleSet = new PeopleSet()
    // let addpeopleset = new AddPeopleSet();
    addPeopleSet.set("name", name)
    // addPeopleSet.set("features", features); These will work when ACLs are added
    // addPeopleSet.set("locations", locations?.id || "Oakland")
    // addPeopleSet.set("departments", departments);
    yield addPeopleSet.save(null, { context: payload })
    setLoading(false)
    toast.success("Set added successfully!")
    // resetForm();
  } catch (error: any) {
    setLoading(false)
    yield sagaErrorHandler(error)
  }
}

export function* watchGetAllPeople() {
  yield takeLatest(types.GET_AllPeople, getAllPeopleRequest)
}
export function* watchGetPeopleSet() {
  yield takeLatest(types.GET_PeopleSet, getPeopleSetRequest)
}
export function* watchAddPeople() {
  yield takeLatest(types.ADD_People, addPeopleRequest)
}

export function* watchAddPeopleSet() {
  yield takeLatest(types.ADD_PeopleSet, addPeopleSetRequest)
}

export default function* appointmentSaga() {
  yield all([fork(watchGetAllPeople), fork(watchGetPeopleSet), fork(watchAddPeople), fork(watchAddPeopleSet)])
}
