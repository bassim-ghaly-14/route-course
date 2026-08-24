import { axiosInstance } from './axiosInstance';

export async function signIn(credentials) {
  const { data } = await axiosInstance.post('/auth/signin', credentials);
  return data;
}

export async function signUp(payload) {
  const { data } = await axiosInstance.post('/auth/signup', payload);
  return data;
}