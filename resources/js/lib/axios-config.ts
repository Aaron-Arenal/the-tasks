import axios from 'axios';

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default axios;