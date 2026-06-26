import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faSpinner, faCartPlus } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import toast from "react-hot-toast";

import RecentProductsSkeleton from "./RecentProductsSkeleton";

export default function RecentProducts() {
  const { addProduct } = useContext(CartContext);

  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [productId, setproductId] = useState(null);

  async function addProductToCart(prodId) {
    setproductId(prodId);
    setBtnLoading(true);

    let response = await addProduct(prodId);

    if (response.data.status === "success") {
      setBtnLoading(false);

      toast.success(response.data.message, {
        position: "bottom-right",
        duration: 1000,
      });
    } else {
      setBtnLoading(false);

      toast.error(response.data.message, {
        position: "bottom-right",
        duration: 1000,
      });
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/products"
        );

        setRecentProducts(data.data || []);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProducts();
  }, []);

  if (loading || recentProducts.length === 0) {
    return <RecentProductsSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-opacity duration-500">
      {recentProducts.map((product) => (
        <div
          key={product._id}
          className="
          group
          overflow-hidden
          rounded-xl
          bg-white
          shadow-md
          hover:shadow-2xl
          hover:-translate-y-1
          transition-all duration-300"
        >
          <Link to={`/productDetails/${product._id}`}>
            <div>
              <div className="p-3">
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-full"
                />

                <span className="text-green-600 text-sm">
                  {product.category?.name}
                </span>

                <h4 className="font-semibold my-2">
                  {product.title?.split(" ").slice(0, 2).join(" ")}
                </h4>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-600 font-semibold">
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
            </div>
          </Link>

          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            disabled={btnLoading && productId === product._id}
            onClick={() => addProductToCart(product._id)}
            className="
              w-full
              flex items-center justify-center gap-2
              min-h-[48px]
              bg-green-600
              cursor-pointer
              text-white
              font-semibold
              py-3
              rounded-b-lg
              hover:bg-green-700
              active:scale-[0.98]
              transition-all duration-300
              focus:outline-none
              focus:ring-4
              focus:ring-green-300
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
          >
            {btnLoading && productId === product._id ? (
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
      ))}
    </div>
  );
}