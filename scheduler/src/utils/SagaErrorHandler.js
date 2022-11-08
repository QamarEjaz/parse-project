import { toast } from "react-toastify";
import { put } from "redux-saga/effects";
// import { logout } from "../Store/Auth/actions";

export function* sagaErrorHandler(error) {
  if (JSON.stringify(error.code) === "209") {
    // yield put(logout());
    toast.error("Your session is expired");
  } else {
    toast.error(JSON.stringify(error.message));
  }
}
