import axios from 'axios';
import { config } from './config';

// config
axios.defaults.withCredentials = true;

// axios.defaults.headers.common['Authorization'] =
//   'Bearer ' + localStorage.getItem('token');

// interceptors
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      err.response?.data?.message === 'Unauthenticated.'
    ) {
      alert("You're logged out, please login again.");
      return (window.location = '/');
    }
    throw err;
  }
);

// custom helper
axios.getUrl = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.app.apiUrl}/api/${url}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error.response));
  });
};

axios.postUrl = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.app.apiUrl}/api/${url}`, data)
      .then((response) => resolve(response))
      .catch((error) => reject(error.response));
  });
};

axios.putUrl = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.app.apiUrl}/api/${url}`, data)
      .then((response) => resolve(response))
      .catch((error) => reject(error.response));
  });
};

export default axios;
