import produce from "immer"
import * as types from "./actionTypes"

const initialState: {
  isNavbarVertical: boolean
} = {
  isNavbarVertical: false,
}

const LayoutReducer = produce((state, action) => {
  switch (action.type) {
    case types.SET_NAVBAR_VERTICAL:
      state.isNavbarVertical = action.payload
      break
    default:
      break
  }
}, initialState)

export default LayoutReducer
