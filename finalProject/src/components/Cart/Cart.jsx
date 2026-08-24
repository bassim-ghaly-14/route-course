import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import CartSkeleton from "./CartSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import {
  useCart,
  useUpdateCartItem,
  useDeleteCartItem,
  useClearCart,
} from "../../hooks/useCart";
import { getApiErrorMessage } from "../../api/apiError";
import { formatPrice } from "../../lib/format";
import ErrorState from "../ui/ErrorState";
import Button from "../ui/Button";

export default function Cart() {
  // Server state comes from the shared ['cart'] query cache.
  const { data, isLoading, isError, refetch } = useCart();
  const updateMutation = useUpdateCartItem();
  const deleteMutation = useDeleteCartItem();
  const clearMutation = useClearCart();

  const cartitems = data?.data;

  // ── Empty-cart confirmation (destructive action) ──────────────────────
  // Same dialog pattern as the Navbar logout confirm: portaled to <body>,
  // Escape-to-close, body scroll lock, backdrop click cancels.
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (!showClearConfirm) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowClearConfirm(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showClearConfirm]);

  async function confirmEmptyCart() {
    try {
      await clearMutation.mutateAsync();
      setShowClearConfirm(false);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, "Failed to empty cart"));
    }
  }

  // The single item currently being mutated (update or remove). Drives
  // per-row loading state AND blocks overlapping mutations on that row.
  const pendingItemId = updateMutation.isPending
    ? updateMutation.variables?.productId
    : deleteMutation.isPending
      ? deleteMutation.variables
      : null;

  async function updateCartProducts(prodId, count) {
    if (pendingItemId) return; // prevent duplicate/overlapping mutations

    if (count < 1) {
      return deleteCartProducts(prodId);
    }

    try {
      await updateMutation.mutateAsync({ productId: prodId, count });
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, "Failed to update quantity"));
    }
  }

  async function deleteCartProducts(prodId) {
    if (pendingItemId) return; // prevent duplicate/overlapping mutations

    try {
      await deleteMutation.mutateAsync(prodId);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, "Failed to remove item"));
    }
  }

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load your cart. Please try again."
        onRetry={() => refetch()}
        className="min-h-[60vh]"
      />
    );
  }

  if (
    !cartitems ||
    !cartitems.products ||
    cartitems.products.length === 0
  ) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
        <FontAwesomeIcon
          icon={faCartShopping}
          aria-hidden="true"
          className="mb-4 text-6xl text-primary-600 animate-bounce"
        />

        <h2 className="text-2xl font-bold text-strong">
          Your Cart is Empty
        </h2>

        <p className="mt-2 max-w-md text-muted">
          Looks like you haven’t added anything yet.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
        >
          Start Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="section-header">
            Shop Now
          </h2>
        </div>

        <div className="card overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left text-sm">
              <thead className="border-b border-primary-100 bg-primary-50">
                <tr>
                  <th scope="col" className="w-28 px-4 py-4 sm:px-5">
                    <span className="sr-only">Image</span>
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-4 font-semibold text-gray-700 sm:px-5"
                  >
                    Product
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-4 font-semibold text-gray-700 sm:px-5"
                  >
                    Qty
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-4 font-semibold text-gray-700 sm:px-5"
                  >
                    Price
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-4 font-semibold text-gray-700 sm:px-5"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {cartitems.products.map((product) => {
                  const isPending = pendingItemId === product.product.id;

                  return (
                  <tr
                    key={product.product.id}
                    className={`border-b border-gray-100 transition-all duration-300 hover:bg-primary-50 ${
                      isPending ? "opacity-60" : ""
                    }`}
                  >
                    <td className="px-4 py-4 sm:px-5">
                      <img
                        src={product.product.imageCover}
                        width={80}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="h-16 w-16 rounded-xl border border-primary-100 object-cover sm:h-20 sm:w-20"
                        alt={product.product.title}
                      />
                    </td>

                    <td className="px-4 py-4 sm:px-5">
                      <h3 className="max-w-xs font-semibold leading-snug text-gray-800 line-clamp-2">
                        {product.product.title}
                      </h3>
                    </td>

                    <td className="px-4 py-4 sm:px-5">
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
                        <button
                          onClick={() =>
                            updateCartProducts(
                              product.product.id,
                              product.count - 1
                            )
                          }
                          disabled={isPending || product.count <= 1}
                          type="button"
                          aria-label={`Decrease quantity of ${product.product.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-200 bg-white transition-all hover:bg-primary-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <svg
                            className="h-3 w-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 12h14"
                            />
                          </svg>
                        </button>

                        <span className="min-w-5 text-center font-bold text-gray-700">
                          {isPending ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              aria-label="Updating quantity"
                            />
                          ) : (
                            product.count
                          )}
                        </span>

                        <button
                          onClick={() =>
                            updateCartProducts(
                              product.product.id,
                              product.count + 1
                            )
                          }
// __CART2__
                          disabled={isPending}
                          type="button"
                          aria-label={`Increase quantity of ${product.product.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-200 bg-white transition-all hover:bg-primary-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <svg
                            className="h-3 w-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 12h14m-7 7V5"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      <span className="text-base font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </span>
                    </td>

                    <td className="px-4 py-4 sm:px-5">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          deleteCartProducts(product.product.id)
                        }
                        className="font-medium text-red-500 transition hover:text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-primary-100 bg-primary-50/40 p-4 sm:p-5 lg:p-6">
            <div className="mb-5 flex flex-col items-center justify-between gap-2 sm:flex-row">
              <h3 className="text-lg font-semibold text-strong sm:text-xl">
                Total Price
                <span className="ml-2 text-sm font-medium text-muted">
                  ({cartitems?.numOfCartItems ?? cartitems?.products?.length}{" "}
                  item
                  {(cartitems?.numOfCartItems ?? cartitems?.products?.length) === 1
                    ? ""
                    : "s"}
                  )
                </span>
              </h3>

              <span className="text-xl font-extrabold text-primary-700 sm:text-2xl">
                {formatPrice(cartitems?.totalCartPrice)}
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                variant="dangerOutline"
                size="lg"
                loading={clearMutation.isPending}
                onClick={() => setShowClearConfirm(true)}
                className="flex-1"
              >
                Empty Cart
              </Button>

              <Link
                to="/checkout"
                aria-label="Proceed to checkout"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-primary-600 py-3 text-base font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
              >
                Check Out
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Empty-cart confirmation ─────────────────────────────────────── */}
      {showClearConfirm &&
        createPortal(
          <div
            className="modal-overlay fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-cart-title"
              aria-describedby="clear-cart-description"
              className="modal-card card w-full max-w-md p-6 text-center shadow-xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-100">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  aria-hidden="true"
                  className="text-2xl text-error"
                />
              </span>

              <h2 id="clear-cart-title" className="mb-2 text-xl font-bold text-strong">
                Empty Your Cart?
              </h2>

              <p
                id="clear-cart-description"
                className="mb-6 text-muted"
              >
                This will permanently remove all items from your cart. This
                action cannot be undone.
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <Button variant="ghost" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  autoFocus
                  loading={clearMutation.isPending}
                  onClick={confirmEmptyCart}
                  className="min-w-36"
                >
                  Empty Cart
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}