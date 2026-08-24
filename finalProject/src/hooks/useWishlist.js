import { useContext, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  fetchWishlist,
  addToWishlistRequest,
  removeFromWishlistRequest,
} from '../api/wishlist';
import { UserContext } from '../Context/UserContext';
import { getApiErrorMessage } from '../api/apiError';

/**
 * Server-backed wishlist (the Route API exposes real /wishlist endpoints).
 * Guests get the same login+returnTo flow as Add-to-Cart; mutations
 * invalidate the single ['wishlist'] cache entry.
 */
export function useWishlist() {
  const { isAuthenticated } = useContext(UserContext);

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}

function useInvalidateWishlist() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['wishlist'] });
}

export function useAddToWishlist() {
  const invalidate = useInvalidateWishlist();
  return useMutation({
    mutationFn: addToWishlistRequest,
    onSuccess: invalidate,
  });
}

export function useRemoveFromWishlist() {
  const invalidate = useInvalidateWishlist();
  return useMutation({
    mutationFn: removeFromWishlistRequest,
    onSuccess: invalidate,
  });
}

/**
 * Shared toggle behavior used by ProductCard/ProductDetails/Wishlist page so
 * guest handling, toasts and pending state stay identical everywhere.
 */
export function useToggleWishlist() {
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const toggle = useCallback(
    async (productId, isInWishlist) => {
      const mutation = isInWishlist ? removeMutation : addMutation;
      if (mutation.isPending) return; // prevent duplicate toggles

      if (!isAuthenticated) {
        toast.error('Please login to manage your wishlist');
        // Same guest-handling pattern as useAddToCart: send the user back to
        // the page they came from after login (Login sanitizes returnTo).
        const returnTo = encodeURIComponent(location.pathname + location.search);
        navigate(`/login?returnTo=${returnTo}`);
        return;
      }

      try {
        await mutation.mutateAsync(productId);
        toast.success(
          isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
          { duration: 1200 }
        );
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Wishlist update failed'), {
          duration: 1500,
        });
      }
    },
    [isAuthenticated, navigate, addMutation, removeMutation, location.pathname, location.search]
  );

  return {
    toggle,
    pendingId: addMutation.isPending
      ? addMutation.variables
      : removeMutation.isPending
        ? removeMutation.variables
        : null,
  };
}

/**
 * One-stop wiring for every ProductCard site (Products, CategoryProducts,
 * Related Products, Recently Viewed…). Returns per-product props so callers
 * never duplicate wishlist state/mutation logic:
 *
 *   const wishlistProps = useWishlistCardProps();
 *   <ProductCard {...wishlistProps.forProduct(product)} />
 */
export function useWishlistCardProps() {
  const { data: products = [] } = useWishlist();
  const { toggle, pendingId } = useToggleWishlist();

  const wishlistedIds = useMemo(
    () => new Set(products.map((p) => p._id)),
    [products]
  );

  const forProduct = useCallback(
    (product) => ({
      onToggleWishlist: toggle,
      isWishlisted: wishlistedIds.has(product._id),
      wishlistPending: pendingId === product._id,
    }),
    [toggle, wishlistedIds, pendingId]
  );

  return { forProduct, wishlistedIds, pendingId };
}
