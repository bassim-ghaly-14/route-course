import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCrack } from "@fortawesome/free-solid-svg-icons";

import { useWishlist, useToggleWishlist } from "../../hooks/useWishlist";
import ProductCard from "../ui/ProductCard";
import Button from "../ui/Button";
import ErrorState from "../ui/ErrorState";

/** Protected server-backed wishlist page (Route API /wishlist endpoints). */
export default function Wishlist() {
  const { data: products = [], isLoading, isError, refetch } = useWishlist();
  const { toggle, pendingId } = useToggleWishlist();

  if (isLoading) {
    return (
      <div className="page-container py-16 text-center font-bold text-primary-700">
        Loading your wishlist…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-container py-16">
        <ErrorState
          message="Failed to load your wishlist."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <section className="page-container py-8">
      <h2 className="section-header">My Wishlist</h2>

      {products.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <FontAwesomeIcon
            icon={faHeartCrack}
            aria-hidden="true"
            className="mb-4 text-6xl text-muted"
          />
          <p className="text-lg font-semibold text-strong">
            Your wishlist is empty
          </p>
          <p className="mt-2 text-muted">
            Tap the heart on any product to save it here.
          </p>
          <Link to="/products" className="mt-6">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted" role="status">
            {products.length} saved item{products.length === 1 ? "" : "s"}
          </p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted
                onToggleWishlist={toggle}
                wishlistPending={pendingId === product._id}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
