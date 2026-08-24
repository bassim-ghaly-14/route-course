import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';

/**
 * Server-side product browsing. Every result-affecting parameter lives in
 * the query key. placeholderData keeps the previous page's grid on screen
 * while the next page loads (TanStack Query 5 replacement for
 * keepPreviousData) so pagination never flashes a skeleton.
 *
 * @param {{ page?: number, sort?: string, categoryId?: string,
 *           brandId?: string, minPrice?: number, maxPrice?: number,
 *           enabled?: boolean }} filters
 */
export default function useProducts(filters = {}) {
  const {
    page = 1,
    sort = 'default',
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    enabled = true,
  } = filters;

  return useQuery({
    queryKey: [
      'products',
      { page, sort, categoryId: categoryId ?? null, brandId: brandId ?? null, minPrice: minPrice ?? null, maxPrice: maxPrice ?? null },
    ],
    queryFn: () => getProducts({ page, sort, categoryId, brandId, minPrice, maxPrice }),
    placeholderData: keepPreviousData,
    // Disabled while a search query is active so browsing never competes
    // with search for requests.
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
