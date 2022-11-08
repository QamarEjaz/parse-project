import { combineReducers } from "redux"
import { connectRouter } from "connected-react-router"
// import history from "../utils/history";
import AuthReducer from "./Auth/reducer"
import BookingReducer from "./Booking/reducer"
import AppointmentReducer from "./Appointment/reducer"
import VirtualReducer from "./Virtual/reducer"
import PeopleManagementReducer from "./PeopleManagement/reducer"
import ScheduleReducer from "./Schedule/reducer"
import PatientReducer from "./Patient/reducer"
import LayoutReducer from "./Layout/reducer"
import AutomationReducer from "./Automation/reducer"

const rootReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    Auth: AuthReducer,
    Booking: BookingReducer,
    Appointment: AppointmentReducer,
    Virtual: VirtualReducer,
    PeopleManagement: PeopleManagementReducer,
    Schedule: ScheduleReducer,
    Patient: PatientReducer,
    Layout: LayoutReducer,
    Automation: AutomationReducer,
  })
export type RootState = ReturnType<typeof rootReducer>

export default rootReducer as any
