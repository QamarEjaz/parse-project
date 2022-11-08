import produce from "immer"
import * as types from "./actionTypes"

const initialState = {
  date: new Date(),
}

const Schedule = produce((state, action) => {
  switch (action.type) {
    case types.SET_DATE:
      state.date = action.payload
      break
    case types.NEXT_DATE: {
      const nextDate = new Date(state.date)
      nextDate.setDate(nextDate.getDate() + 1)
      state.date = nextDate
      break
    }
    case types.PREV_DATE: {
      const prevDate = new Date(state.date)
      prevDate.setDate(prevDate.getDate() - 1)
      state.date = prevDate
      break
    }
    default:
      break
  }
}, initialState)

export default Schedule
