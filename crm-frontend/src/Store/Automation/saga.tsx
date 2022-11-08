import Parse from "parse"
import { fork, put, all, takeLatest } from "redux-saga/effects"
import { toast } from "react-toastify"
import { CREATE_AUTOMATION, DELETE_POLICY, GET_POLICY_LIST, GET_SINGLE_POLICY, GET_SOURCES, GET_SOURCE_KEYS, POLICY_STATUS } from "./actionTypes"
import { sagaErrorHandler } from "../../utils/SagaErrorHandler"
import { getSourcesSuccess, getSourceKeysSuccess, getPolicyListSuccess, getPolicyList, getSinglePolicySuccess } from "./actions"

function* getSourcesRequest(): any {
  try {
    const query = new Parse.Query("Sources")
    const sourcesResult = yield query.findAll()
    yield put(getSourcesSuccess(sourcesResult?.map((source: any) => source.toJSON())))
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* getSourceKeysRequest({ payload }: any): any {
  try {
    let keys = yield Parse.Cloud.run("getSchemaKeys", {
      tableName: payload,
    })
    yield put(getSourceKeysSuccess(keys))
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* getPolicyListRequest({ payload }: any): any {
  try {
    const query = new Parse.Query("AutomationPolicy")
    const policyResult = yield query.findAll()
    yield put(getPolicyListSuccess(policyResult?.map((source: any) => source.toJSON())))
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* deletePolicyRequest({ payload }: any): any {
  try {
    yield Parse.Cloud.run("deleteAutomationPolicy", {
      policyId: payload,
    })
    yield put(getPolicyList())
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* changePolicyStatusRequest({ payload }: any): any {
  try {
    yield Parse.Cloud.run("toggleEnableAutomationPolicy", {
      policyId: payload.policyId,
      isActive: payload.isActive,
    })
    yield put(getPolicyList())
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* getSinglePolicyRequest({ payload }: any): any {
  console.log("payload", payload)
  try {
    let response = yield Parse.Cloud.run("getAutomationPolicyData", {
      policyId: payload.policyId,
    })
    yield put(getSinglePolicySuccess(response))
    payload.setPage(1)
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

function* createAutomationRequest({ payload }: any): any {
  const { sourceValue, criteriaValues, actionValue, inputs, setPage, selectedPolicyId } = payload
  try {
    if (selectedPolicyId) {
      yield Parse.Cloud.run("deleteAutomationPolicy", {
        policyId: selectedPolicyId,
      })
    }
    let data = {
      source: sourceValue.value,
      policyName: sourceValue.label + "_" + criteriaValues[0].key.value + "_" + actionValue?.label,
      criterias: criteriaValues,
      actions: { actionName: actionValue.label, priority: actionValue.index, params: inputs },
    }
    console.log("data", data)
    yield Parse.Cloud.run("createAutomationPolicy", data)
    payload.setSourceValue("")
    payload.setCriteriaValues([{ key: "", operator: "", value: "", priority: "" }])
    payload.setActionValue("")
    payload.setActionParams([])
    payload.setInputs([])
    payload.setSelectedPolicyId("")
    toast.success(`Policy ${selectedPolicyId ? "updated" : "created"} successfully`)
    setPage(2)
  } catch (error: any) {
    yield sagaErrorHandler(error)
  }
}

export function* watchGetSources() {
  yield takeLatest(GET_SOURCES, getSourcesRequest)
}
export function* watchGetSourcesKeys() {
  yield takeLatest(GET_SOURCE_KEYS, getSourceKeysRequest)
}
export function* watchGetPolicyList() {
  yield takeLatest(GET_POLICY_LIST, getPolicyListRequest)
}
export function* watchDeletePolicy() {
  yield takeLatest(DELETE_POLICY, deletePolicyRequest)
}
export function* watchChangePolicyStatus() {
  yield takeLatest(POLICY_STATUS, changePolicyStatusRequest)
}
export function* watchGetSinglePolicy() {
  yield takeLatest(GET_SINGLE_POLICY, getSinglePolicyRequest)
}
export function* watchCreateAutomation() {
  yield takeLatest(CREATE_AUTOMATION, createAutomationRequest)
}

export default function* automationSaga() {
  yield all([fork(watchGetSources), fork(watchGetSourcesKeys), fork(watchGetPolicyList), fork(watchDeletePolicy), fork(watchChangePolicyStatus), fork(watchGetSinglePolicy), fork(watchCreateAutomation)])
}
