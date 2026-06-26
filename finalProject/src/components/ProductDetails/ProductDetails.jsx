import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCartPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useState , useContext } from 'react';
import useProductDetails from '../../hooks/useProductDetails';
import useRelatedProducts from '../../hooks/useRelatedProducts';

import { CartContext } from '../../Context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const { addProduct } = useContext(CartContext);
  const [addingToCart, setAddingToCart] = useState(false);

  const { data: product, isLoading, isError } = useProductDetails(id);

  const { data: related } = useRelatedProducts(
    product?.category?._id,
    product?._id
  );

  async function handleAddToCart() {
  if (addingToCart) return;

  try {
    setAddingToCart(true);

    const response = await addProduct(product._id);

    if (response?.data?.status === 'success') {
      toast.success('Added to cart');
    } else {
      toast.error('Failed');
    }
  } catch {
    toast.error('Failed');
  } finally {
    setAddingToCart(false);
  }
}

  if (isLoading) {
    return (
      <div className="text-center py-10 text-green-600 font-bold">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load product
      </div>
    );
  }

  return (
    <div className="container mx-auto px-10 py-8">

      <div className="grid md:grid-cols-2 gap-10">

        <img
          src={product.imageCover}
          className="w-full rounded-lg"
          alt={product.title}
        />

        <div>
          <h2 className="text-3xl font-bold mb-4">
            {product.title}
          </h2>

          <p className="text-gray-600 mb-4">
            {product.description}
          </p>

          <div className="flex justify-between mb-4">
            <span className="text-green-600 font-bold text-xl">
              {product.price} EGP
            </span>

            <span>
              <FontAwesomeIcon
                icon={faStar}
                className="text-yellow-400"
              />
              {" "}
              {product.ratingsAverage}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addingToCart}
            aria-label={`Add ${product.title} to cart`}
            className="
              flex items-center justify-center gap-3
              w-full md:w-auto
              min-h-[52px]
              px-8 py-4
              rounded-xl
              cursor-pointer
              bg-green-600
              text-white
              font-semibold
              shadow-lg
              shadow-green-600/20
              hover:bg-green-700
              hover:shadow-xl
              hover:shadow-green-600/30
              active:scale-95
              transition-all duration-300
              focus:outline-none
              focus:ring-4
              focus:ring-green-300
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
          >
            {addingToCart ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Adding...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCartPlus} />
                Add To Cart
              </>
            )}
          </button>
        </div>

      </div>

      <h3 className="text-xl font-bold mt-10 text-green-600">
        Related Products
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
        {related?.map((p) => (
          <Link
            key={p._id}
            to={`/productDetails/${p._id}`}
            className="shadow rounded-lg p-2 hover:shadow-xl transition-all duration-300 hover:scale-105 block"
          >
            <img
              src={p.imageCover}
              alt={p.title}
              className="w-full"
            />

            <p className="font-bold mt-2 line-clamp-2">
              {p.title}
            </p>

            <div className="flex justify-between items-center mt-2">
              <span className="text-green-600 font-semibold">
                {p.price} EGP
              </span>

              <span>
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-yellow-400"
                />
                {" "}
                {p.ratingsAverage}
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}