import { useQuery } from '@tanstack/react-query';
import { getCategoryProducts } from '../api/products';

export default function useCategoryProducts(categoryId) {
  return useQuery({
    queryKey: ['category-products', categoryId],
    queryFn: () => getCategoryProducts(categoryId),
    enabled: !!categoryId,
  });
}