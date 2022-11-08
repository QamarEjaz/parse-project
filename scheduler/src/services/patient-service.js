import axios from "../lib/axios";

// export const fetchPatients = async (query) =>
//   await axios.getUrl(`booking/allPatients?${query}`);

// export const createPatient = async (data) => {
//   await axios.postUrl("booking/patient", data);
// };

export const createPatient = async (data) =>
  await axios.postUrl("crm/patients", data);

export const successLog = async (data) =>
  await axios.postUrl("booking/patient/log/success", data);
