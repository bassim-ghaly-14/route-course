import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../api/products';

export default function useProductDetails(productId) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });
}