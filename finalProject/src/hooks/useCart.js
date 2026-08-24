import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import {
  fetchCart,
  addToCartRequest,
  updateCartItemRequest,
  deleteCartItemRequest,
  clearCartRequest,
} from '../api/cart';
import { UserContext } from '../Context/UserContext';

/** The single authoritative cart server-state source. */
export function useCart() {
  const { isAuthenticated } = useContext(UserContext);

  return useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: isAuthenticated,
    // Cart data is highly mutable; avoid serving it stale within a session.
    staleTime: 30 * 1000,
  });
}

function useInvalidateCart() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: ['cart'] });
}

export function useAddCartItem() {
  const invalidateCart = useInvalidateCart();
  return useMutation({
    mutationFn: addToCartRequest,
    onSuccess: invalidateCart,
  });
}

export function useUpdateCartItem() {
  const invalidateCart = useInvalidateCart();
  return useMutation({
    mutationFn: ({ productId, count }) =>
      updateCartItemRequest(productId, count),
    onSuccess: invalidateCart,
  });
}

export function useDeleteCartItem() {
  const invalidateCart = useInvalidateCart();
  return useMutation({
    mutationFn: deleteCartItemRequest,
    onSuccess: invalidateCart,
  });
}

export function useClearCart() {
  const invalidateCart = useInvalidateCart();
  return useMutation({
    mutationFn: clearCartRequest,
    onSuccess: invalidateCart,
  });
}