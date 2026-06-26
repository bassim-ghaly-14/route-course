import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../api/axiosInstance';

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) =>
      axiosInstance.post('/cart', { productId }),

    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
  });
}