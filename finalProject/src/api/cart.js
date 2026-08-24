import { axiosInstance } from './axiosInstance';

/** GET /cart — the authoritative cart server-state source. */
export async function fetchCart() {
  const { data } = await axiosInstance.get('/cart');
  return data;
}

export async function addToCartRequest(productId) {
  const { data } = await axiosInstance.post('/cart', { productId });
  return data;
}

export async function updateCartItemRequest(productId, count) {
  const { data } = await axiosInstance.put(`/cart/${productId}`, { count });
  return data;
}

export async function deleteCartItemRequest(productId) {
  const { data } = await axiosInstance.delete(`/cart/${productId}`);
  return data;
}

export async function clearCartRequest() {
  const { data } = await axiosInstance.delete('/cart');
  return data;
}

/**
 * POST /orders/checkout-session/:cartId?url=<origin>
 * Returns the checkout body ({ status, session: { url }, ... });
 * redirecting to Stripe stays the caller's responsibility.
 */
export async function createCheckoutSession(cartId, url, shippingAddress) {
  const { data } = await axiosInstance.post(
    `/orders/checkout-session/${cartId}?url=${url}`,
    { shippingAddress }
  );
  return data;
}