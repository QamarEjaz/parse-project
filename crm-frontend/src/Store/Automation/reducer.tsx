import Parse from "parse"
import produce from "immer"
import * as types from "./actionTypes"
import { parseConfig } from "../../utils/ParseConfig"

parseConfig()

const initialState = {
  sources: [],
  sourceKeys: null,
  policyList: null,
  singlePolicy: null,
}

const Automation = produce((state, action) => {
  switch (action.type) {
    case types.GET_SOURCES_SUCCESS:
      state.sources = action.payload
      break
    case types.GET_SOURCE_KEYS_SUCCESS:
      state.sourceKeys = action.payload
      break
    case types.GET_POLICY_LIST_SUCCESS:
      state.policyList = action.payload
      break
    case types.GET_SINGLE_POLICY_SUCCESS:
      state.singlePolicy = action.payload
      break
    default:
      break
  }
}, initialState)

export default Automation
