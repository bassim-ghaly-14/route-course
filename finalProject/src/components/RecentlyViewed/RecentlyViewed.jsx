import { useState } from "react";
import { getRecentlyViewed } from "../../lib/recentlyViewed";
import ProductCard from "../ui/ProductCard";
import { useWishlistCardProps } from "../../hooks/useWishlist";

/**
 * "Recently viewed" strip. Reads minimal product data from localStorage
 * (safely parsed in the lib). Renders nothing when there is no history so
 * first-time visitors never see an empty section.
 */
export default function RecentlyViewed() {
  // Lazy initializer: storage is only read once on mount (client-only app).
  const [items] = useState(getRecentlyViewed);
  const wishlist = useWishlistCardProps();

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="recently-viewed-header">
      <h2 id="recently-viewed-header" className="section-header">
        Recently Viewed
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {items.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            {...wishlist.forProduct(product)}
          />
        ))}
      </div>
    </section>
  );
}
