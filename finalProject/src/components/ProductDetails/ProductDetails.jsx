import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCartPlus,
  faShareNodes,
  faCheck,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

import useProductDetails from "../../hooks/useProductDetails";
import useRelatedProducts from "../../hooks/useRelatedProducts";
import useAddToCart from "../../hooks/useAddToCart";
import { useWishlistCardProps } from "../../hooks/useWishlist";

import { recordRecentlyViewed } from "../../lib/recentlyViewed";
import { formatPrice } from "../../lib/format";

import ProductCard from "../ui/ProductCard";
import Button from "../ui/Button";
import Breadcrumb from "../ui/Breadcrumb";
import ErrorState from "../ui/ErrorState";

const MAX_QUANTITY = 20;

export default function ProductDetails() {
  const { id } = useParams();

  const { addToCart, addingId } = useAddToCart();
  const wishlist = useWishlistCardProps();
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const { data: product, isLoading, isError, refetch } = useProductDetails(id);

  const { data: related } = useRelatedProducts(
    product?.category?._id,
    product?._id
  );

  // Recently-viewed tracking: minimal data, deduped, capped in the lib.
  useEffect(() => {
    if (product?._id) recordRecentlyViewed(product);
  }, [product?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }

// __PART2__


  if (isLoading) {
    return (
      <div className="py-10 text-center font-bold text-primary-700">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load product"
        onRetry={refetch}
      />
    );
  }

  const hasDiscount =
    product.priceAfterDiscount != null &&
    Number(product.priceAfterDiscount) < Number(product.price);
  const inStock = (product.quantity ?? 1) > 0;

  return (
    <div className="page-container py-8">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          ...(product.category?.name
            ? [
                {
                  label: product.category.name,
                  to: `/categories/${product.category._id}`,
                },
              ]
            : []),
          { label: product.title },
        ]}
      />

      <div className="grid gap-8 md:grid-cols-2 md:gap-10">

        <img
          src={product.imageCover}
          width={600}
          height={600}
          className="aspect-square w-full rounded-2xl object-cover shadow-md"
          alt={product.title}
        />

        <div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-strong">
            {product.title}
          </h1>

          <p className="mb-6 leading-relaxed text-muted">
            {product.description}
          </p>

          {/* Price + rating + availability */}
          <div className="mb-6 rounded-xl bg-primary-50 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                {hasDiscount && (
                  <span className="mr-2 text-base text-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="text-2xl font-extrabold text-primary-700">
                  {formatPrice(
                    hasDiscount ? product.priceAfterDiscount : product.price
                  )}
                </span>
              </div>

              <span className="flex items-center gap-1.5 font-medium text-strong">
                <FontAwesomeIcon
                  icon={faStar}
                  aria-hidden="true"
                  className="text-yellow-400"
                />
                {product.ratingsAverage}
              </span>
            </div>

            <p
              className={`mt-2 text-sm font-semibold ${
                inStock ? "text-primary-700" : "text-error"
              }`}
              role="status"
            >
              {inStock ? (
                <>
                  In stock
                  {product.quantity != null && ` (${product.quantity} available)`}
                </>
              ) : (
                "Out of stock"
              )}
            </p>
          </div>

          {/* Quantity selector */}
          <div className="mb-6 flex items-center gap-4">
            <span id="quantity-label" className="font-medium text-strong">
              Quantity
            </span>

            <div
              role="group"
              aria-labelledby="quantity-label"
              className="flex items-center gap-2"
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1 || addingId === product._id}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-lg font-bold transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>

              <span
                aria-live="polite"
                aria-label={`Quantity: ${quantity}`}
                className="w-10 text-center text-lg font-bold text-strong"
              >
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                disabled={
                  quantity >=
                    Math.min(
                      MAX_QUANTITY,
                      product.quantity ?? MAX_QUANTITY
                    ) ||
                  !inStock ||
                  addingId === product._id
                }
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-lg font-bold transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              loading={addingId === product._id}
              disabled={addingId === product._id || !inStock}
              onClick={() => addToCart(product._id, quantity)}
              aria-label={`Add ${quantity} ${product.title} to cart`}
              className="w-full md:w-auto"
            >
              {addingId === product._id ? (
                "Adding..."
              ) : (
                <>
                  <FontAwesomeIcon icon={faCartPlus} aria-hidden="true" />
                  Add To Cart
                </>
              )}
            </Button>

            {/* Wishlist toggle — same shared hook/mutation as ProductCard */}
            <Button
              variant="outline"
              size="lg"
              aria-pressed={wishlist.wishlistedIds.has(product._id)}
              aria-label={
                wishlist.wishlistedIds.has(product._id)
                  ? `Remove ${product.title} from wishlist`
                  : `Add ${product.title} to wishlist`
              }
              disabled={wishlist.pendingId === product._id}
              onClick={() =>
                wishlist.forProduct(product).onToggleWishlist(
                  product._id,
                  wishlist.wishlistedIds.has(product._id)
                )
              }
              className="w-full md:w-auto"
            >
              <FontAwesomeIcon
                icon={
                  wishlist.wishlistedIds.has(product._id)
                    ? faHeartSolid
                    : faHeartRegular
                }
                aria-hidden="true"
                className={`transition-colors duration-200 ${
                  wishlist.wishlistedIds.has(product._id) ? "text-error" : ""
                }`}
              />
              {wishlist.pendingId === product._id
                ? "Saving…"
                : wishlist.wishlistedIds.has(product._id)
                  ? "Wishlisted"
                  : "Add to Wishlist"}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleCopyLink}
              aria-label="Copy product link"
              className="w-full md:w-auto"
            >
              <FontAwesomeIcon
                icon={copied ? faCheck : faShareNodes}
                aria-hidden="true"
              />
              {copied ? "Link Copied" : "Share"}
            </Button>
          </div>
        </div>

      </div>

      <h3 className="section-header mt-12 text-xl sm:text-2xl">
        Related Products
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {related?.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            {...wishlist.forProduct(p)}
          />
        ))}
      </div>

    </div>
  );
}