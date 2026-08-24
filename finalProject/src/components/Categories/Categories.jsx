import { Link } from "react-router-dom";
import useCategories from "../../hooks/useCategories";
import CategoriesSkeleton from "./CategoriesSkeleton";
import ErrorState from "../ui/ErrorState";

export default function Categories() {
  const { data: categories = [], isLoading, isError, refetch } = useCategories();

  if (isLoading) {
    return <CategoriesSkeleton />
  }

  if (isError) {
    return (
      <div className="page-container py-10">
        <ErrorState
          message="Failed to load categories. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <section className="page-container py-10">

      <h2 className="section-header">
        Shop Popular Categories
      </h2>

      {categories.length === 0 ? (
        <div className="py-10 text-center text-muted">
          No categories found
        </div>
      ) : (
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">

        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/categories/${category._id}`}
            aria-label={`Browse ${category.name}`}
            className="
            card group relative overflow-hidden
            transition-all duration-300
            hover:-translate-y-2 hover:shadow-lg
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200
            "
          >

            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-52"
            />

            <div className="p-4 text-center">

              <h3 className="font-bold text-strong transition group-hover:text-primary-700">
                {category.name}
              </h3>

            </div>

          </Link>
        ))}

      </div>
      )}

    </section>
  );
}
