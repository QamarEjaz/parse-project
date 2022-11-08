import Parse from "parse"
import produce from "immer"
import * as types from "./actionTypes"
import { parseConfig } from "../../utils/ParseConfig"

parseConfig()

const initialState = {
  AllPeoples: [],
  PeopleSet: [],
}

const Auth = produce((state, action) => {
  switch (action.type) {
    case types.GET_AllPeople_SUCCESS:
      state.AllPeoples = action.payload
      break
    case types.GET_PeopleSet_SUCCESS:
      state.PeopleSet = action.payload
      break
    default:
      break
  }
}, initialState)

export default Auth