import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categories';

/** Single shared source for category data (Home slider + Categories page). */
export default function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
  });
}