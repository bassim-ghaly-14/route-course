import { useQuery } from '@tanstack/react-query';
import { getBrands } from '../api/brands';

/** Shared brand list for the products filter toolbar. */
export default function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}
