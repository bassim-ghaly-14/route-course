import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ProductsSkeleton from "./ProductsSkeleton";

import useProducts from '../../hooks/useProducts';

export default function Products() {
  const { data, isLoading, isError, error } = useProducts();

  if (isLoading) {
    return <ProductsSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        {error.message}
      </div>
    );
  }

  return (
    <section className="py-10 container mx-auto px-10">
      <h2 className="text-2xl font-bold mb-6 text-green-600">
        Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {data?.map((product) => (
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

            <div className="p-3">
              <span className="text-green-600 text-sm">
                {product.category?.name}
              </span>

              <h4 className="font-semibold">
                {product.title.split(' ').slice(0, 2).join(' ')}
              </h4>

              <div className="flex justify-between items-center">
                <span className="text-green-600">
                  {product.price} EGP
                </span>

                <span>
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                  {product.ratingsAverage}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}