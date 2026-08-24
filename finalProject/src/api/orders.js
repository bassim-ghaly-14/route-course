import { axiosInstance } from './axiosInstance';

/**
 * The Route Academy API has no direct GET /orders/:id endpoint — orders are
 * always fetched per user via GET /orders/user/:userId and filtered
 * client-side. This service intentionally models only what the API offers.
 */
export async function getUserOrders(userId) {
  const { data } = await axiosInstance.get(`/orders/user/${userId}`);
  return Array.isArray(data) ? data : data?.data || [];
}