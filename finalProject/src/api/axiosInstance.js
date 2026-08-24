import axios from 'axios';
import { notifyUnauthorized } from './unauthorizedHandler';

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

// Centralized session-expiry handling: any UNEXPECTED 401 (i.e. not a
// failed login/signup attempt, which is normal validation feedback)
// is delegated to the handler registered by UserContextProvider so that
// React state, localStorage and the React Query cache are torn down
// together in one place. This interceptor never mutates auth state.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';

    if (status === 401 && !url.startsWith('/auth/')) {
      notifyUnauthorized();
    }

    return Promise.reject(error);
  }
);

