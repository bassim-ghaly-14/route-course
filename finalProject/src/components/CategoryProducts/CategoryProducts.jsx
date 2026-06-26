import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import ProductsSkeleton from "./ProductsSkeleton";

export default function CategoryProducts() {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCategoryProducts() {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `https://ecommerce.routemisr.com/api/v1/products?category=${id}`
        );

        setProducts(data.data || []);
      } catch (err) {
        console.log(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    getCategoryProducts();
  }, [id]);

  if (loading) {
    return <ProductsSkeleton />;
  }

  return (
    <div className="container mx-auto px-10 py-8">
      <h2 className="text-2xl font-bold mb-6 text-green-600">
        Category Products
      </h2>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No products found in this category
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/productDetails/${product._id}`}
              className="group overflow-hidden rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-full"
              />

              <div className="p-2">
                <span className="text-green-600 text-sm">
                  {product.category?.name}
                </span>

                <h4 className="font-semibold">
                  {product.title.split(" ").slice(0, 2).join(" ")}
                </h4>

                <div className="flex justify-between">
                  <span className="text-green-600">
                    {product.price} EGP
                  </span>

                  <span>
                    <FontAwesomeIcon
                      className="text-yellow-400"
                      icon={faStar}
                    />
                    {product.ratingsAverage}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}