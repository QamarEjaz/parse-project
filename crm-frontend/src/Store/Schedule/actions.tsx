import { IOption } from "../../components/Inputs/Select/Select.interfaces"
import * as types from "./actionTypes"
export const setDate = (date: Date): { type: string; payload: Date } => {
  return {
    type: types.SET_DATE,
    payload: date,
  }
}
export const nextDate = (): { type: string } => {
  return {
    type: types.NEXT_DATE,
  }
}
export const prevDate = (): { type: string } => {
  return {
    type: types.PREV_DATE,
  }
}
