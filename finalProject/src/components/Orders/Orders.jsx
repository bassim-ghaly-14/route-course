import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import useOrders from "../../hooks/useOrders";
import Button from "../ui/Button";
import ErrorState from "../ui/ErrorState";
import Breadcrumb from "../ui/Breadcrumb";
import OrderCard from "./OrderCard";
import OrdersSkeleton from "./OrdersSkeleton";

const ORDERS_PER_PAGE = 5;

/** My Orders — polished order history built on the shared useOrders()
    React Query cache. Pagination stays client-side over the cached list. */
export default function Orders() {
  const { data: orders = [], isLoading, isError, refetch } = useOrders();

  const [currentPage, setCurrentPage] = useState(1);

  // Newest first, derived from the shared orders cache.
  const orderedOrders = useMemo(() => [...orders].reverse(), [orders]);

  const totalPages = Math.ceil(orderedOrders.length / ORDERS_PER_PAGE);

  // Guard against an out-of-range page (e.g. after data shrinks).
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const currentOrders = orderedOrders.slice(
    (safePage - 1) * ORDERS_PER_PAGE,
    safePage * ORDERS_PER_PAGE
  );

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  if (isError) {
    return (
      <section className="page-container py-8 sm:py-10">
        <ErrorState
          message="We couldn't load your orders. Please try again."
          onRetry={refetch}
        />
      </section>
    );
  }

  if (!orderedOrders.length) {
    return (
      <section className="page-container py-8 sm:py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-line bg-surface px-6 py-16 text-center shadow-sm sm:py-20">
          <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-3xl text-primary-600">
            <FontAwesomeIcon icon={faBoxOpen} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-strong sm:text-3xl">
            No orders yet
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            Your completed purchases will appear here.
          </p>
          <Link to="/products" className="mt-8 inline-block">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-container py-8 sm:py-10">
      {/* Page header */}
      <header>
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Orders" }]} />
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-primary-700 sm:text-4xl">
              My Orders
            </h1>
            <p className="mt-2 text-muted">
              Track and manage your recent purchases.
            </p>
          </div>

          <p className="text-sm text-muted" aria-live="polite">
            {orderedOrders.length}{" "}
            {orderedOrders.length === 1 ? "order" : "orders"} · page {safePage}{" "}
            of {totalPages}
          </p>
        </div>
      </header>

      {/* Order list */}
      <ol className="mt-6 space-y-4 sm:mt-8" aria-label="Your orders">
        {currentOrders.map((order) => (
          <li key={order._id}>
            <OrderCard order={order} />
          </li>
        ))}
      </ol>

      {/* Pagination (client-side over the cached orders list) */}
      {totalPages > 1 && (
        <nav
          aria-label="Orders pagination"
          className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
            Prev
          </Button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isCurrent = pageNumber === safePage;

            return (
              <Button
                key={pageNumber}
                variant={isCurrent ? "primary" : "ghost"}
                onClick={() => setCurrentPage(pageNumber)}
                disabled={isCurrent}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Go to page ${pageNumber}`}
                className={`min-w-11 ${isCurrent ? "" : "border border-line bg-surface"}`}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            Next
            <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
          </Button>
        </nav>
      )}
    </section>
  );
}
