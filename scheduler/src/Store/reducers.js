import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import AppointmentReducer from "./Appointment/reducer";
import AuthRed from "./Auth/reducer";
import LocationReducer from "./Location/reducer";
import PatientReducer from "./Patient/reducer";
// ==============================|| COMBINE REDUCER ||============================== //

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    AuthRed: AuthRed,
    Appointment: AppointmentReducer,
    Location: LocationReducer,
    Patient: PatientReducer,
  });

export default rootReducer;
