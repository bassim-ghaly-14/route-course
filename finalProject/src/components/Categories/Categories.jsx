import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import CategoriesSkeleton from "./CategoriesSkeleton";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
    async function fetchCategories() {
        try {
        setError(null);
        const { data } = await axiosInstance.get("/categories");

        setCategories(data.data || []);
        } catch (err) {
        console.error(err);
        setError("Failed to load categories. Please try again.");
        } finally {
        setLoading(false);
        }
    }

    fetchCategories();
    }, []);

  if (loading) {
    return <CategoriesSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-10">

      <h2 className="text-green-600 text-2xl font-bold mb-6">
        Shop Popular Categories
      </h2>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No categories found
        </div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category._id}`}
            className="
            group
            relative
            overflow-hidden
            rounded-3xl
            shadow-lg
            hover:shadow-2xl
            transition-all
            duration-300
            hover:-translate-y-2
            "
          >

            <img
              src={category.image}
              alt={category.name}
              className="h-52 w-full object-cover"
            />

            <div className="p-5 text-center">

              <h3 className="font-bold text-xl text-gray-800 group-hover:text-green-600 transition">
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
