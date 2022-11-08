import Parse from "parse";
import produce from "immer";
import * as types from "./actionTypes"

const initialState = {
    patientTypes: [],
    user: Parse.User.current() ? Parse.User.current() : null,

};

const Patient = produce((state, action) => {
    switch (action.type) {
        default:
            break
        case types.UPDATE_PATIENT_INFO: {
            state.user = Parse.User.current();
            break

        }
        case types.UPLOAD_ATTACHMENT: {
            state.user = Parse.User.current();
            break

        }
        case types.GET_PATIENT_TYPES_SUCCESS:
            state.patientTypes = action.payload
            break
    }

}, initialState)

export default Patient