import produce from "immer"
import * as types from "./actionTypes"

const initialState = {
  virtuals: [],
  virtual: null,
  virtualTableSubcscription: null,
  virtualPeopleSubscription: null,
  virtualAppointmentSubscription: null,
}

const VirtualReducers = produce((state, action) => {
  switch (action.type) {
    case types.GET_PATEINT_QUEUE_SUCCESS:
      state.virtuals = action.payload
      break
    case types.GET_SINGLE_PATIENT_QUEUE_SUCCESS:
      state.virtual = action.payload
      break
    case types.SET_VIRTUAL_TABLE_SUBSCRIPTION: {
      state.virtualTableSubcscription = action.payload
      break
    }
    case types.SET_PEOPLE_TABLE_SUBSCRIPTION: {
      state.virtualPeopleSubscription = action.payload
      break
    }
    case types.SET_APPOINTMENT_TABLE_SUBSCRIPTION: {
      state.virtualAppointmentSubscription = action.payload
      break
    }
    default:
      break
  }
}, initialState)

export default VirtualReducers
