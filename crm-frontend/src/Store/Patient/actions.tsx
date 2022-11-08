import { RegisterData } from '../../Types/PatientTypes';
import * as types from "./actionTypes"

export const registerPatient = (data: RegisterData) => {
    return {
        type: types.REGISTER_PATIENT,
        payload: data,
    };
};
export const updatePatientInfo = (data: any) => {
    return {
        type: types.UPDATE_PATIENT_INFO,
        payload: data,
    }
}
export const getPatientTypes = () => {
    return {
        type: types.GET_PATIENT_TYPES,
    }
}
export const getPatientTypesSuccess = (data: any) => {
    return {
        type: types.GET_PATIENT_TYPES_SUCCESS,
        payload: data,
    }
}
export const uploadAttachment = (data: any) => {
    return {
        type: types.UPLOAD_ATTACHMENT,
        payload: data,
    }
}