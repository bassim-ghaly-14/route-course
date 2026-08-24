import { axiosInstance } from './axiosInstance';

/**
 * Route Academy wishlist API (verified live: the route exists and requires
 * auth — it returns 401 for guests instead of the API's 404 "route" error).
 *   GET    /wishlist          → list of wishlist products
 *   POST   /wishlist          → { productId }
 *   DELETE /wishlist/:productId
 */

function normalize(responseData) {
  // Defensive: different Route deployments wrap items either as full product
  // objects or as { _id, product } join rows. Normalize to product objects.
  const items = Array.isArray(responseData)
    ? responseData
    : responseData?.data || [];

  return items
    .map((item) => item?.product?._id ? item.product : item)
    .filter((item) => item?._id);
}

export async function fetchWishlist() {
  const { data } = await axiosInstance.get('/wishlist');
  return normalize(data.data ?? data);
}

export async function addToWishlistRequest(productId) {
  const { data } = await axiosInstance.post('/wishlist', { productId });
  return data;
}

export async function removeFromWishlistRequest(productId) {
  const { data } = await axiosInstance.delete(`/wishlist/${productId}`);
  return data;
}
