import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { formatPrice } from '../../lib/format';

/**
 * The single product-card visual used by Products, CategoryProducts, Search,
 * Wishlist, Recently Viewed and Related Products. `children` (optional)
 * renders below the linkable card body — e.g. the shared Add-To-Cart button,
 * which keeps its guest/authentication behavior in the parent.
 *
 * `onToggleWishlist` (optional) enables the heart action; wishlist state is
 * passed by the parent so this card stays a pure presentation component.
 */
export default function ProductCard({
  product,
  children,
  onToggleWishlist,
  isWishlisted = false,
  wishlistPending = false,
}) {
  const hasDiscount =
    product.priceAfterDiscount != null &&
    Number(product.priceAfterDiscount) < Number(product.price);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:ring-4 focus-within:ring-primary-200">
      {hasDiscount && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-error px-2 py-0.5 text-xs font-bold text-white shadow-sm">
          Sale
        </span>
      )}

      {onToggleWishlist && (
        <button
          type="button"
          aria-pressed={isWishlisted}
          aria-label={
            isWishlisted
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          disabled={wishlistPending}
          onClick={(e) => {
            // The heart sits next to (not inside) the product Link, but stop
            // propagation defensively so it can never trigger navigation.
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product._id, isWishlisted);
          }}
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface/90 shadow-sm transition duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FontAwesomeIcon
            icon={isWishlisted ? faHeartSolid : faHeartRegular}
            aria-hidden="true"
            className={`text-lg transition-colors duration-200 ${
              isWishlisted ? 'text-error' : 'text-muted'
            }`}
          />
        </button>
      )}

      <Link
        to={`/products/${product._id}`}
        className="flex flex-col focus-visible:outline-none"
        aria-label={`${product.title}, ${formatPrice(product.price)}`}
      >
        <div className="overflow-hidden bg-gray-100">
          <img
            src={product.imageCover}
            alt={product.title}
            loading="lazy"
            width={400}
            height={400}
            decoding="async"
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-3">
          <span className="text-xs font-medium uppercase tracking-wide text-primary-600">
            {product.category?.name}
          </span>

          <h4 className="mt-1 line-clamp-2 font-semibold leading-snug text-strong">
            {product.title?.split(' ').slice(0, 2).join(' ')}
          </h4>

          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-muted line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="font-bold text-primary-700">
                {formatPrice(hasDiscount ? product.priceAfterDiscount : product.price)}
              </span>
            </div>

            <span className="flex items-center gap-1 text-sm text-muted">
              <FontAwesomeIcon
                icon={faStar}
                aria-hidden="true"
                className="text-yellow-400"
              />
              {product.ratingsAverage}
            </span>
          </div>
        </div>
      </Link>

      {children}
    </div>
  );
}
