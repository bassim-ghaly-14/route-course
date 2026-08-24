import { axiosInstance } from './axiosInstance';

export async function getCategories() {
  const { data } = await axiosInstance.get('/categories');
  return data.data || [];
}