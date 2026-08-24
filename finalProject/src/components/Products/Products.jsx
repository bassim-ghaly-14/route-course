import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";
import useBrands from "../../hooks/useBrands";
import useProductSearch from "../../hooks/useProductSearch";
import useAddToCart from "../../hooks/useAddToCart";
import { useWishlistCardProps } from "../../hooks/useWishlist";

import ProductsSkeleton from "./ProductsSkeleton";
import ProductToolbar from "./ProductToolbar";
import ProductsPagination from "./ProductsPagination";
import ProductCard from "../ui/ProductCard";
import ErrorState from "../ui/ErrorState";
import Button from "../ui/Button";

/** Reads `min-max` price-range strings into API bounds. Defensive against
    hand-edited URLs: anything that is not exactly `<number>-<number>`
    (either side optional) is ignored entirely so no NaN ever reaches the
    API. Valid states such as `0-500`, `10-20`, and `6000-` are preserved. */
function parsePriceRange(value) {
  if (!value) return {};

  const parts = value.split("-");
  if (parts.length !== 2) return {};

  const [rawMin, rawMax] = parts;
  const min = rawMin === "" ? undefined : Number(rawMin);
  const max = rawMax === "" ? undefined : Number(rawMax);

  if (
    (min !== undefined && !Number.isFinite(min)) ||
    (max !== undefined && !Number.isFinite(max)) ||
    (min !== undefined && max !== undefined && min > max)
  ) {
    return {};
  }

  // Zero min is meaningless as a lower bound — skip it like before.
  return {
    ...(min !== undefined && min > 0 && { minPrice: min }),
    ...(max !== undefined && { maxPrice: max }),
  };
}

export default function Products() {
  // Search/sort/filter/page state lives in the URL: shareable, survives
  // back-navigation, and preserved when returning from a product page.
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "default";
  const categoryId = searchParams.get("category") ?? "";
  const brandId = searchParams.get("brand") ?? "";
  const priceRange = searchParams.get("price") ?? "";
  const page = Number(searchParams.get("page")) || 1;

  function updateParam(key, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        // Any filter/search change resets pagination.
        if (key !== "page") next.delete("page");
        return next;
      },
      { replace: true }
    );
  }

  function clearAll() {
    setSearchParams({}, { replace: true });
  }

  function goToPage(nextPage) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(nextPage));
        return next;
      },
      { replace: true }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isSearchActive = query.trim().length > 0;
  const hasActiveFilters = Boolean(
    sort !== "default" || categoryId || brandId || priceRange || query
  );

  const { addToCart, addingId } = useAddToCart();
  const wishlist = useWishlistCardProps();
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  // Server-side browse — paused while searching so requests never compete.
  const browseQuery = useProducts({
    page,
    sort,
    ...(categoryId && { categoryId }),
    ...(brandId && { brandId }),
    ...parsePriceRange(priceRange),
    enabled: !isSearchActive,
  });

  // Debounced client-side search (API keyword param verified broken).
  const search = useProductSearch(query);

  const gridData = useMemo(() => {
    if (isSearchActive) {
      return {
        products: search.results,
        numberOfPages: 1,
        totalResults: search.results.length,
      };
    }
    return {
      products: browseQuery.data?.products ?? [],
      numberOfPages:
        browseQuery.data?.metadata?.numberOfPages ??
        (browseQuery.data?.products?.length ? 1 : 0),
      totalResults: browseQuery.data?.totalResults ?? 0,
    };
  }, [isSearchActive, search.results, browseQuery.data]);

  const showBrowseSkeleton =
    !isSearchActive &&
    (browseQuery.isLoading || browseQuery.isFetching) &&
    !browseQuery.isPlaceholderData;
  const isErrorState = isSearchActive ? search.isError : browseQuery.isError;

  function retry() {
    if (isSearchActive) search.refetch();
    else browseQuery.refetch();
  }

  return (
    <section className="page-container py-8">
      <h2 className="section-header">Products</h2>

      <ProductToolbar
        query={query}
        sort={sort}
        categoryId={categoryId}
        brandId={brandId}
        priceRange={priceRange}
        categories={categories}
        brands={brands}
        hasActiveFilters={hasActiveFilters}
        onParamChange={updateParam}
        onClearAll={clearAll}
      />

      {isErrorState ? (
        <ErrorState
          message={
            isSearchActive
              ? "Search failed. Please try again."
              : "Failed to load products. Please try again."
          }
          onRetry={retry}
        />
      ) : showBrowseSkeleton ? (
        <ProductsSkeleton />
      ) : gridData.products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-semibold text-strong">
            {isSearchActive ? "No products match your search" : "No products found"}
          </p>
          <p className="mt-2 text-muted">
            {isSearchActive
              ? `Nothing found for “${query.trim()}”. Try a different term.`
              : "Try adjusting or resetting your filters."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" className="mt-5" onClick={clearAll}>
              Clear everything
            </Button>
          )}
        </div>
      ) : (
        <>
          {!isSearchActive && (
            <p className="mb-4 text-sm text-muted" role="status" aria-live="polite">
              {gridData.totalResults} product
              {gridData.totalResults === 1 ? "" : "s"} found
            </p>
          )}

          {/* placeholderData keeps the previous page visible during page
              switches — no skeleton flash between pages. */}
          <div aria-busy={browseQuery.isPlaceholderData}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {gridData.products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  {...wishlist.forProduct(product)}
                >
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
                      focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200
                      disabled:cursor-not-allowed disabled:opacity-70
                    "
                  >
                    {addingId === product._id ? (
                      "Adding…"
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
          </div>

          {!isSearchActive && (
            <ProductsPagination
              page={page}
              numberOfPages={gridData.numberOfPages}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </section>
  );
}

