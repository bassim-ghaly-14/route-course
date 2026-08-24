import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { getUserOrders } from '../api/orders';
import { UserContext } from '../Context/UserContext';

/**
 * Shared orders server-state. userId comes from UserContext (never decoded
 * in components). The key includes userId so cached data can never leak
 * between accounts.
 */
export default function useOrders() {
  const { isAuthenticated, userId } = useContext(UserContext);

  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => getUserOrders(userId),
    enabled: !!(isAuthenticated && userId),
  });
}