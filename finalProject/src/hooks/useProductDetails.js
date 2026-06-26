import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../api/axiosInstance';

async function fetchProduct(id) {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data.data;
}

export default function useProductDetails(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}