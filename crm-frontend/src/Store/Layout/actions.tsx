import * as types from "./actionTypes"

export const setNavbarVertical = (isNavbarVertical: boolean) => {
  return {
    type: types.SET_NAVBAR_VERTICAL,
    payload: isNavbarVertical,
  }
}
