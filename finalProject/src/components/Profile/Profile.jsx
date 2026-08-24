import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBox,
  faBoxOpen,
  faHeart,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import { UserContext } from "../../Context/UserContext";
import { CartContext } from "../../Context/CartContext";
import useOrders from "../../hooks/useOrders";
import { useWishlist } from "../../hooks/useWishlist";

import Button from "../ui/Button";
import ErrorState from "../ui/ErrorState";
import ProfileStatCard from "./ProfileStatCard";
import RecentOrderRow from "./RecentOrderRow";

const RECENT_ORDERS_LIMIT = 3;

/** Account dashboard: hero + clickable activity summary + recent orders.
    All counts come from the shared React Query caches — no extra requests. */
export default function Profile() {
  const { user } = useContext(UserContext);
  const { cartItemsCount } = useContext(CartContext);

  // Shared server-state sources (single cached request each):
  const { data: wishlistItems = [], isLoading: wishlistLoading } =
    useWishlist();
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useOrders();

  const displayName = user?.name || user?.email || "there";

  const latestOrders = useMemo(
    () => [...orders].reverse().slice(0, RECENT_ORDERS_LIMIT),
    [orders]
  );

  const statCards = [
    {
      to: "/wishlist",
      icon: faHeart,
      label: "Wishlist",
      count: wishlistItems.length,
      unit: wishlistItems.length === 1 ? "item" : "items",
      actionLabel: "View wishlist",
      isLoading: wishlistLoading,
    },
    {
      to: "/cart",
      icon: faCartShopping,
      label: "Cart",
      // cartItemsCount mirrors the Navbar badge (numOfCartItems semantics).
      count: cartItemsCount,
      unit: cartItemsCount === 1 ? "item" : "items",
      actionLabel: "View cart",
    },
    {
      to: "/orders",
      icon: faBox,
      label: "Orders",
      count: orders.length,
      unit: orders.length === 1 ? "order" : "orders",
      actionLabel: "View orders",
      isLoading: ordersLoading,
    },
  ];

  return (
    <section className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="relative bg-linear-to-r from-primary-600 via-primary-600 to-primary-700">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="page-container relative z-10 py-12 sm:py-16">
          <div className="flex flex-col-reverse items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
            <div>
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-md">
                Premium Member
              </span>

              <h1 className="mt-5 text-3xl font-black text-white sm:text-4xl md:text-6xl">
                Welcome back, {displayName}
              </h1>

              <p className="mt-3 text-lg text-primary-100">
                {user?.email
                  ? `${user.email} · Manage your account and keep track of your shopping activity.`
                  : "Manage your account and keep track of your shopping activity."}
              </p>
            </div>

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-4xl font-bold text-white shadow-lg backdrop-blur-lg sm:h-28 sm:w-28">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="page-container relative z-20 -mt-10 pb-16">
        {/* Account overview — every card is a shortcut */}
        <h2 className="sr-only">Account overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {statCards.map((card) => (
            <ProfileStatCard key={card.to} {...card} />
          ))}
        </div>

        {/* Recent Orders */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-surface shadow-sm sm:mt-10">
          <div className="flex flex-col gap-3 bg-linear-to-r from-primary-600 to-primary-500 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Recent Orders
              </h2>
              <p className="mt-1 text-primary-100">
                Your latest activity on the account
              </p>
            </div>

            {!ordersLoading && !ordersError && orders.length > 0 && (
              <Link
                to="/orders"
                className="group inline-flex items-center gap-2 self-start rounded-xl bg-white/20 px-4 py-2 font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/30"
              >
                View all orders
                <FontAwesomeIcon
                  icon={faArrowRight}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>

          <div className="space-y-4 p-4 sm:p-8">
            {ordersError ? (
              <ErrorState
                message="Failed to load your recent orders."
                onRetry={refetchOrders}
              />
            ) : ordersLoading ? (
              [1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="h-18.5 animate-pulse rounded-2xl bg-gray-100"
                />
              ))
            ) : latestOrders.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-4 text-6xl text-primary-600">
                  <FontAwesomeIcon icon={faBoxOpen} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-strong">
                  No Orders Yet
                </h3>
                <p className="mt-2 text-muted">
                  When you place your first order it will appear here.
                </p>
                <Link to="/products" className="mt-6 inline-block">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            ) : (
              latestOrders.map((order) => (
                <RecentOrderRow key={order._id} order={order} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}