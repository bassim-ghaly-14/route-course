import axios from 'axios';

export const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach the auth token (the Route API expects it in a
// custom "token" header) to every outgoing request, so callers no
// longer need to rebuild this header manually on each call.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');

  if (token) {
    config.headers.token = token;
  }

  return config;
});
