import * as types from "./actionTypes"

export const getSources = () => {
  return {
    type: types.GET_SOURCES,
  }
}
export const getSourcesSuccess = (data: any) => {
  return {
    type: types.GET_SOURCES_SUCCESS,
    payload: data,
  }
}

export const getSourceKeys = (data: any) => {
  return {
    type: types.GET_SOURCE_KEYS,
    payload: data,
  }
}
export const getSourceKeysSuccess = (data: any) => {
  return {
    type: types.GET_SOURCE_KEYS_SUCCESS,
    payload: data,
  }
}
export const getPolicyList = () => {
  return {
    type: types.GET_POLICY_LIST,
  }
}
export const getPolicyListSuccess = (data: any) => {
  return {
    type: types.GET_POLICY_LIST_SUCCESS,
    payload: data,
  }
}
export const deletePolicy = (data: any) => {
  return {
    type: types.DELETE_POLICY,
    payload: data,
  }
}
export const policyStatus = (data: any) => {
  return {
    type: types.POLICY_STATUS,
    payload: data,
  }
}

export const getSinglePolicy = (data: any) => {
  return {
    type: types.GET_SINGLE_POLICY,
    payload: data,
  }
}
export const getSinglePolicySuccess = (data: any) => {
  return {
    type: types.GET_SINGLE_POLICY_SUCCESS,
    payload: data,
  }
}
export const createAutomation = (data: any) => {
  return {
    type: types.CREATE_AUTOMATION,
    payload: data,
  }
}
