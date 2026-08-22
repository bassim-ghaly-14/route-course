import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../Context/CartContext";
import { Link } from "react-router-dom";
import CartSkeleton from "./CartSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

export default function Cart() {
  const [cartitems, setcartitems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    getLoggedCart,
    updateProduct,
    deleteProduct,
    emptyCart,
  } = useContext(CartContext);

  async function getCartItems() {
    try {
      setError(null);

      const response = await getLoggedCart();

      setcartitems(response.data.data);

      if (response.data.cartId) {
        localStorage.setItem("cartId", response.data.cartId);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function updateCartProducts(prodId, count) {
    if (count < 1) {
      return deleteCartProducts(prodId);
    }

    try {
      const response = await updateProduct(prodId, count);
      setcartitems(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    }
  }

  async function deleteCartProducts(prodId) {
    try {
      const response = await deleteProduct(prodId);
      setcartitems(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  }

  async function emptyCartProducts() {
    try {
      await emptyCart();

      setcartitems({
        products: [],
        totalCartPrice: 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to empty cart");
    }
  }

  useEffect(() => {
    async function loadCart() {
      await getCartItems();
    }

    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
        <p className="mb-4 text-red-600">{error}</p>

        <button
          onClick={getCartItems}
          className="rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
        >
          Try Again
        </button>
      </section>
    );
  }

  if (
    !cartitems ||
    !cartitems.products ||
    cartitems.products.length === 0
  ) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
        <FontAwesomeIcon
          icon={faCartShopping}
          className="mb-4 text-6xl text-green-600 animate-bounce"
        />

        <h2 className="text-2xl font-bold text-gray-700">
          Your Cart is Empty
        </h2>

        <p className="mt-2 max-w-md text-gray-500">
          Looks like you haven’t added anything yet.
        </p>

        <Link
          to="/products"
          className="mt-6 rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
        >
          Start Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold text-green-600 sm:text-3xl">
            Shop Now
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-green-100 bg-green-50">
                <tr>
                  <th scope="col" className="w-28 px-4 py-4 sm:px-5">
                    <span className="sr-only">Image</span>
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-4 font-semibold text-gray-700 sm:px-5"
                  >
                    Product
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-4 font-semibold text-gray-700 sm:px-5"
                  >
                    Qty
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-4 font-semibold text-gray-700 sm:px-5"
                  >
                    Price
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-4 font-semibold text-gray-700 sm:px-5"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {cartitems.products.map((product) => (
                  <tr
                    key={product.product.id}
                    className="border-b border-gray-100 transition-all duration-300 hover:bg-green-50"
                  >
                    <td className="px-4 py-4 sm:px-5">
                      <img
                        src={product.product.imageCover}
                        className="h-16 w-16 rounded-xl border border-green-100 object-cover sm:h-20 sm:w-20"
                        alt={product.product.title}
                      />
                    </td>

                    <td className="px-4 py-4 sm:px-5">
                      <h3 className="max-w-xs font-semibold leading-snug text-gray-800 line-clamp-2">
                        {product.product.title}
                      </h3>
                    </td>

                    <td className="px-4 py-4 sm:px-5">
                      <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-2.5 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
                        <button
                          onClick={() =>
                            updateCartProducts(
                              product.product.id,
                              product.count - 1
                            )
                          }
                          type="button"
                          aria-label={`Decrease quantity of ${product.product.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-green-200 bg-white transition-all hover:bg-green-600 hover:text-white"
                        >
                          <svg
                            className="h-3 w-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 12h14"
                            />
                          </svg>
                        </button>

                        <span className="min-w-5 text-center font-bold text-gray-700">
                          {product.count}
                        </span>

                        <button
                          onClick={() =>
                            updateCartProducts(
                              product.product.id,
                              product.count + 1
                            )
                          }
                          type="button"
                          aria-label={`Increase quantity of ${product.product.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-green-200 bg-white transition-all hover:bg-green-600 hover:text-white"
                        >
                          <svg
                            className="h-3 w-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 12h14m-7 7V5"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      <span className="text-base font-bold text-green-600">
                        {product.price} EGP
                      </span>
                    </td>

                    <td className="px-4 py-4 sm:px-5">
                      <button
                        type="button"
                        onClick={() =>
                          deleteCartProducts(product.product.id)
                        }
                        className="font-medium text-red-500 transition hover:text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-green-100 bg-green-50/40 p-4 sm:p-5 lg:p-6">
            <div className="mb-5 flex flex-col items-center justify-between gap-2 sm:flex-row">
              <h3 className="text-lg font-semibold text-gray-700 sm:text-xl">
                Total Price
              </h3>

              <span className="text-xl font-bold text-green-600 sm:text-2xl">
                {cartitems?.totalCartPrice} EGP
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={emptyCartProducts}
                className="flex-1 rounded-xl border border-red-200 bg-white py-3 font-medium text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white"
              >
                Empty Cart
              </button>

              <Link
                to="/checkout"
                className="flex-1 rounded-xl bg-green-600 py-3 text-center font-medium text-white shadow-md transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
              >
                Check Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}