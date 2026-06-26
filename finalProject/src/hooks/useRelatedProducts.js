import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../api/axiosInstance';

async function fetchRelated(categoryId, productId) {
  const { data } = await axiosInstance.get(
    `/products?category[in]=${categoryId}`
  );

  return data.data.filter((p) => p._id !== productId);
}

export default function useRelatedProducts(categoryId, productId) {
  return useQuery({
    queryKey: ['related', categoryId],
    queryFn: () => fetchRelated(categoryId, productId),
    enabled: !!categoryId,
  });
}