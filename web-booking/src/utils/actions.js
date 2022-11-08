import axios from './axios';
import moment from './moment';
import {
  cleanPhoneNumber,
  formatDate,
  getFormattedLocationName,
} from './helpers';
import { config } from './config';

// Auth
export const csrf = () => axios.get(`${config.app.apiUrl}/sanctum/csrf-cookie`);

export const generateOTP = (phone) =>
  axios.postUrl('auth/otp/generate', { phone: cleanPhoneNumber(phone) });

export const validateOTP = (phone, code) =>
  axios.postUrl('auth/otp/verify', {
    phone: cleanPhoneNumber(phone),
    otp: code,
    platform: 'web',
  });

// Patient
export const createPatient = (data) =>
  axios.postUrl('booking/patient', {
    ...data,
    dateOfBirth: moment(data.dateOfBirth, 'MM-DD-YYYY').format('YYYY-MM-DD'),
    phones: [
      {
        sequence: 1,
        number: cleanPhoneNumber(data.phones[0].number),
        phoneType: 'MOBILE',
      },
    ],
    contactMethod: 'CALL ME',
    patientStatus: 'NEW',
    languageType: 'ENGLISH',
  });

export const fetchPatients = () => axios.getUrl('booking/patient');

export const checkPatientByEmail = (email) =>
  axios.postUrl('patient/email-exists', { email });

// Location
export const fetchLocations = (latitude = 0, longitude = 0) =>
  axios.getUrl(
    `booking/location?patient_id=195373&patient_latitude=${latitude}&patient_longitude=${longitude}`
  );

export const updateLocation = (patientID, locationID) =>
  axios.putUrl(`booking/patient/${patientID}`, {
    location_id: locationID,
  });

// Schedule Openings
export const fetchScheduleOpening = (location, reason, date) =>
  axios.getUrl(
    `booking/available-date?location_id=${location}&reason=${reason}&start_date=${formatDate(
      date,
      'YYYY-MM-DD'
    )}&end_date=${formatDate(date, 'YYYY-MM-DD')}&showBy=disable`
  );

export const fetchDisabledScheduleOpening = (location, reason, date) => {
  let start_date = moment(date).startOf('month').format('YYYY-MM-DD');
  let end_date = moment(date).endOf('month').format('YYYY-MM-DD');

  return axios.getUrl(
    `booking/available-date?location_id=${location}&reason=${reason}&start_date=${start_date}&end_date=${end_date}&showBy=disable`
  );
};

// Appointment
export const createAppointment = ({ patient, location, slot, note }) =>
  axios.postUrl(
    `booking/patients/${patient.id}/appointments?include=locationModel`,
    {
      location_id: location,
      date: slot.date,
      start: slot.start,
      note: note,
      source: 'web',
    }
  );

// export const updateAppointment = (data) =>
//   axios.putUrl(`booking/appointment/${data.id}`, data);

// Card
export const createCard = (data) => axios.postUrl('booking/square-card', data);

export const fetchPatientCards = (id) =>
  axios.getUrl(`booking/patient/${id}/cards`);

// Insurance Info
export const createInsuranceInfo = (data) =>
  axios.postUrl(`booking/patients/${data.patient_id}/insurances`, data);

// Log Patient
export const logPatient = (data) => axios.postUrl(`booking/patient/log`, data);

// Log Success Patient
export const logSuccessPatient = (data) =>
  axios.postUrl(`booking/patient/log/success`, data);

export const logCreditFailsPatient = (data) =>
  axios.postUrl(`booking/patient/log/credit-fails`, data);
