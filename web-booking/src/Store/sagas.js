import { all } from "redux-saga/effects";
import PersonalInfoSaga from "./AddPersonalInfo/saga";
import authSaga from "./Auth/saga";
import FamilyMember from "./CreateFamilyMember/saga";
import LocationSaga from "./Location/saga";

export default function* rootSaga() {
  yield all([authSaga(), FamilyMember(), PersonalInfoSaga(), LocationSaga()]);
}
