import axios from 'axios';
import { baseURL } from './config';


const axiosAuth = axios.create({
  baseURL
})

axiosAuth.interceptors.request.use(config => {
  let token = localStorage.token
  config.headers.Authorization = `Bearer ${token}`
  return config;
}, (error) => {
  return Promise.reject(error)
})

axiosAuth.interceptors.response.use(response => {
  return response;
}, (error) => {
  console.log(error.response)
  if (error.response.data.error === "Unauthorized" && error.response.status === 401) {
    // localStorage.removeItem('token');
    // location.reload();
  }
  return Promise.reject(error);
})


const axiosInstance = axios.create({
  baseURL
})


export { axiosAuth, axiosInstance }