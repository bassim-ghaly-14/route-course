import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { useAddCartItem } from './useCart';
import { getApiErrorMessage } from '../api/apiError';
import toast from 'react-hot-toast';

/**
 * Shared Add-To-Cart behavior used by ProductDetails and RecentProducts so
 * guest handling / toasts / loading state are never duplicated or
 * inconsistent between entry points. The API call itself is a React Query
 * mutation that invalidates the shared ['cart'] cache.
 */
export default function useAddToCart() {
  const { userToken } = useContext(UserContext);
  const addMutation = useAddCartItem();
  const navigate = useNavigate();
  const location = useLocation();

  async function addToCart(prodId, quantity = 1) {
    if (addMutation.isPending) return;

    if (!userToken) {
      // Guests are guided to login instead of firing a doomed 401 request.
      const returnTo = encodeURIComponent(location.pathname + location.search);
      toast.error('Please login to add products to your cart');
      navigate(`/login?returnTo=${returnTo}`);
      return;
    }

    try {
      // The API increments by one per POST /cart call, so a requested
      // quantity is fulfilled through sequential requests under ONE shared
      // loading state (no parallel writes → no race conditions).
      let lastResponse = null;
      for (let i = 0; i < quantity; i++) {
        lastResponse = await addMutation.mutateAsync(prodId);
      }

      if (lastResponse?.status === 'success') {
        toast.success(
          quantity > 1
            ? `${quantity} items added to cart`
            : lastResponse.message || 'Added to cart',
          {
            position: 'bottom-right',
            duration: 1000,
          }
        );
      } else {
        toast.error('Failed to add product to cart', {
          position: 'bottom-right',
          duration: 1000,
        });
      }
    } catch (err) {
      console.error(err);
      // An expired/invalid token is handled GLOBALLY by the axios response
      // interceptor + UserContextProvider (single canonical session teardown
      // + redirect to /login). Here we only give the user context-specific
      // feedback for other failures.
      if (err?.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
        return;
      }
      toast.error(getApiErrorMessage(err, 'Failed to add product to cart'), {
        position: 'bottom-right',
        duration: 1000,
      });
    }
  }

  return { addToCart, addingId: addMutation.isPending ? addMutation.variables : null };
}