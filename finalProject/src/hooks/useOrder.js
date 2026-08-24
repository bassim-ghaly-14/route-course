import useOrders from "./useOrders";

/**
 * The Route Academy API has no GET /orders/:id endpoint, so an order is
 * resolved client-side from the shared user-orders query (same safe
 * strategy the app used before). Reuses one cache entry + one request.
 */
export default function useOrder(orderId) {
  const query = useOrders();

  const order =
    query.data?.find((o) => o._id === orderId) ?? null;

  return {
    ...query,
    data: order,
    notFound: !query.isLoading && !!query.data && !order,
  };
}