import { useParams } from "react-router-dom";

import useCategoryProducts from "../../hooks/useCategoryProducts";
import useCategories from "../../hooks/useCategories";
import ProductsSkeleton from "./ProductsSkeleton";
import ProductCard from "../ui/ProductCard";
import Breadcrumb from "../ui/Breadcrumb";
import ErrorState from "../ui/ErrorState";
import { useWishlistCardProps } from "../../hooks/useWishlist";

export default function CategoryProducts() {
  const { id } = useParams();

  const { data: products = [], isLoading, isError, refetch } = useCategoryProducts(id);
  const { data: categories = [] } = useCategories();
  const wishlist = useWishlistCardProps();

  // Category name resolved from the shared categories cache (no extra API
  // call); falls back gracefully if the cache is cold.
  const categoryName = categories.find((c) => c._id === id)?.name ?? "Category";

  if (isLoading) {
    return <ProductsSkeleton />;
  }

  return (
    <div className="page-container py-8">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Categories", to: "/categories" },
          { label: categoryName },
        ]}
      />

      <h2 className="section-header">{categoryName}</h2>

      {isError ? (
        <ErrorState
          message="Failed to load products. Please try again."
          onRetry={refetch}
        />
      ) : products.length === 0 ? (
        <div className="py-10 text-center text-muted">
          No products found in this category
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              {...wishlist.forProduct(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
