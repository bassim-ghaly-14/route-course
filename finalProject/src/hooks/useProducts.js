import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../api/axiosInstance';

async function fetchProducts() {
  const { data } = await axiosInstance.get('/products');
  return data.data;
}

export default function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}