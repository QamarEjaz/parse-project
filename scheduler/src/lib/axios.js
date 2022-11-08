import axios from 'axios';

// config
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// interceptors
// axios.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (
//       err.response?.status === 401 &&
//       err.response?.data?.message === 'Unauthenticated.'
//     ) {
//       alert("You're logged out, please login again.");
//       return (window.location = '/');
//     }
//     throw err;
//   }
// );

// custom helper
axios.getUrl = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/${url}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error.response));
  });
};

axios.postUrl = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/${url}`, data)
      .then((response) => resolve(response))
      .catch((error) => reject(error.response));
  });
};

axios.putUrl = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`/api/${url}`, data)
      .then((response) => resolve(response))
      .catch((error) => reject(error.response));
  });
};

export default axios;
