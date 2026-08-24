import { useQuery } from '@tanstack/react-query';
import { getRelatedProducts } from '../api/products';

export default function useRelatedProducts(categoryId, productId) {
  return useQuery({
    // productId MUST be part of the key: the fetch filters out the current
    // product, so navigating between products of the same category would
    // otherwise return a cached list missing the new current product.
    queryKey: ['related-products', categoryId, productId],
    queryFn: () => getRelatedProducts(categoryId, productId),
    enabled: !!categoryId,
  });
}