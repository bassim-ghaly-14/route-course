import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCartPlus } from "@fortawesome/free-solid-svg-icons";

import useAddToCart from "../../hooks/useAddToCart";
import useProducts from "../../hooks/useProducts";
import ProductCard from "../ui/ProductCard";
import ErrorState from "../ui/ErrorState";

import RecentProductsSkeleton from "./RecentProductsSkeleton";

export default function RecentProducts() {
  const { addToCart, addingId } = useAddToCart();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useProducts();

  const recentProducts = data?.products ?? [];

  if (isLoading) {
    return <RecentProductsSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-6">
        <ErrorState
          message="Failed to load products."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (recentProducts.length === 0) {
    return (
      <div className="py-10 text-center text-muted">
        No products available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {recentProducts.map((product) => (
        <ProductCard key={product._id} product={product}>
          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            disabled={addingId === product._id}
            onClick={() => addToCart(product._id)}
            className="
              flex min-h-12 w-full items-center justify-center gap-2
              border-t border-line bg-primary-600
              font-semibold text-white
              transition-colors duration-300
              hover:bg-primary-700
              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-primary-200
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >
            {addingId === product._id ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin aria-hidden="true" />
                Adding...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCartPlus} aria-hidden="true" />
                Add To Cart
              </>
            )}
          </button>
        </ProductCard>
      ))}
    </div>
  );
}