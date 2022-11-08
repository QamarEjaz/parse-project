import axios from "./axios";
import moment from "./moment";
import {
  cleanPhoneNumber,
  formatDate,
  getFormattedLocationName,
} from "../utils/helpers";

import { config } from "../utils/config";

// Auth
export const csrf = () => axios.get(`${config.app.apiUrl}/sanctum/csrf-cookie`);

export const generateOTP = (phone) =>
  axios.postUrl("auth/otp/generate", { phone: cleanPhoneNumber(phone) });

export const validateOTP = (phone, code) =>
  axios.postUrl("auth/otp/verify", {
    phone: cleanPhoneNumber(phone),
    otp: code,
    platform: "web",
  });

// Patient
export const createPatient = (data) =>
  axios.postUrl("booking/patient", {
    ...data,
    dateOfBirth: moment(data.dateOfBirth, "MM-DD-YYYY").format("YYYY-MM-DD"),
    phones: [
      {
        sequence: 1,
        number: cleanPhoneNumber(data.phones[0].number),
        phoneType: "MOBILE",
      },
    ],
    contactMethod: "CALL ME",
    patientStatus: "NEW",
    languageType: "ENGLISH",
  });

// export const fetchPatients = () => axios.getUrl("booking/patient");

export const checkPatientByEmail = (email) =>
  axios.postUrl("patient/email-exist", { email });

// Location
export const fetchLocations = () => axios.getUrl("booking/location");

export const updateLocation = (patientID, locationID) =>
  axios.putUrl(`booking/patient/${patientID}`, {
    location_id: locationID,
  });

// Schedule Openings
export const fetchScheduleOpening = (location, reason, date) =>
  axios.getUrl(
    `booking/available-date?location_id=${location}&reason=${reason}&start_date=${formatDate(
      date,
      "YYYY-MM-DD"
    )}&end_date=${formatDate(date, "YYYY-MM-DD")}&showBy=disable`
  );

export const fetchDisabledScheduleOpening = (location, reason, date) => {
  let start_date = moment(date).startOf("month").format("YYYY-MM-DD");
  let end_date = moment(date).endOf("month").format("YYYY-MM-DD");

  return axios.getUrl(
    `booking/available-date?location_id=${location}&reason=${reason}&start_date=${start_date}&end_date=${end_date}&showBy=disable`
  );
};

// Appointment
export const createAppointment = ({ patient, location, slot, date, note }) =>
  axios.postUrl(
    `booking/patients/${patient.id}/appointments?include=locationModel`,
    {
      location_id: location,
      date: formatDate(date, "YYYY-MM-DD"),
      start: slot.start,
      note: note,
      source: "web",
    }
  );

// export const updateAppointment = (data) =>
//   axios.putUrl(`booking/appointment/${data.id}`, data);

// Card
export const createCard = (data) => axios.postUrl("booking/square-card", data);

export const fetchPatientCards = (id) =>
  axios.getUrl(`booking/patient/${id}/cards`);

// Insurance Info
export const createInsuranceInfo = (data) =>
  axios.postUrl(`booking/patients/${data.patient_id}/insurances`, data);

// Log Patient
export const logPatient = ({
  firstName: first_name,
  lastName: last_name,
  emailAddress: email,
  phones: [{ number: phone }],
  origin,
  type,
}) =>
  axios.postUrl(`booking/patient/log`, {
    first_name,
    last_name,
    email,
    phone,
    origin,
    type,
  });

// Log Success Patient
export const logSuccessPatient = ({
  firstName: first_name,
  lastName: last_name,
  emailAddress: email,
  phones: [{ number: phone }],
  origin,
  type,
  start,
  location_model: location,
  reason,
}) =>
  axios.postUrl(`booking/patient/log/success`, {
    origin,
    type,
    first_name,
    last_name,
    email,
    phone,
    location: getFormattedLocationName(location),
    reason,
    date: formatDate(start, "MMMM D, YYYY"),
    time: formatDate(start, "hh:mm a"),
  });
