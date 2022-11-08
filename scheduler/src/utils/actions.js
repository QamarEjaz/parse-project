import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export const fetcher = (url) => axios.get(url).then((res) => res.data);

export const csrf = async () =>
  await axios.get(`${process.env.REACT_APP_API_URL}/sanctum/csrf-cookie`);

// export const getUser = async () =>
//   await axios.get(`${process.env.REACT_APP_API_URL}/api/user`);

export const login = async (data) =>
  await axios.post(`${process.env.REACT_APP_API_URL}/login`, data);

export const fetchPatients = async (query) =>
  await axios.get(
    `${process.env.REACT_APP_API_URL}/api/booking/allPatients?${query}`
  );

export const logout = () =>
  axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`);

export const fetchAgoraToken = (channel, uid) =>
  axios.post(`${process.env.REACT_APP_API_URL}/api/crm/talk/token`, {
    slug: channel,
    uid,
  });
