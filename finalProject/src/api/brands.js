import { axiosInstance } from './axiosInstance';

/** GET /brands — brand list for the products filter toolbar. */
export async function getBrands() {
  const { data } = await axiosInstance.get('/brands', {
    params: { limit: 200 },
  });
  return data.data || [];
}