import axios from "../lib/axios";

export const createAppointment = (data) =>
  axios.postUrl(`scheduler/book/appointment`, data);
