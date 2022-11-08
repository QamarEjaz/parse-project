import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import PersonalInfoReducer from "./AddPersonalInfo/reducer";
import AuthRed from "./Auth/reducer";
import FamilyMember from "./CreateFamilyMember/reducer";
import LocationReducer from "./Location/reducer";
// ==============================|| COMBINE REDUCER ||============================== //

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    AuthRed: AuthRed,
    FamilyMember: FamilyMember,
    PersonalInfoReducer: PersonalInfoReducer,
    Location: LocationReducer,
  });

export default rootReducer;
