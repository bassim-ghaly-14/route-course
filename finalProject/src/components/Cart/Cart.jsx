import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../Context/CartContext";
import { Link } from "react-router-dom";
import CartSkeleton from "./CartSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function Cart() {
  const [cartitems, setcartitems] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    getLoggedCart,
    updateProduct,
    deleteProduct,
    emptyCart,
  } = useContext(CartContext);

  async function getCartItems() {
    try {
      const response = await getLoggedCart();

      console.log(response.data);

      setcartitems(response.data.data);

      localStorage.setItem("cartId", response.data.cartId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateCartProducts(prodId, count) {
    const response = await updateProduct(prodId, count);
    setcartitems(response.data.data);
  }

  async function deleteCartProducts(prodId) {
    const response = await deleteProduct(prodId);
    setcartitems(response.data.data);
  }

  async function emptyCartProducts() {
  await emptyCart();

  setcartitems({
    products: [],
    totalCartPrice: 0,
  });
  }

  useEffect(() => {
    async function loadCart() {
      await getCartItems();
    }

    loadCart();
  }, []);

  if (loading) {
    return <CartSkeleton />;
  }

  if (
    !cartitems ||
    !cartitems.products ||
    cartitems.products.length === 0
  ) {
    return (
      <section className="py-16 flex flex-col items-center justify-center text-center">
        <FontAwesomeIcon
          icon={faCartShopping}
          className="text-green-600 text-6xl mb-4 animate-bounce"
        />

        <h2 className="text-2xl font-bold text-gray-700">
          Your Cart is Empty
        </h2>

        <p className="text-gray-500 mt-2">
          Looks like you haven’t added anything yet.
        </p>

        <Link
          to="/products"
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
        >
          Start Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl text-green-600 py-10 font-bold">
        Shop Now
      </h2>

      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-green-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-green-50 border-b border-green-100">
            <tr>
              <th scope="col" className="px-16 py-4">
                <span className="sr-only">Image</span>
              </th>

              <th
                scope="col"
                className="px-6 py-4 font-semibold text-gray-700"
              >
                Product
              </th>

              <th
                scope="col"
                className="px-6 py-4 font-semibold text-gray-700"
              >
                Qty
              </th>

              <th
                scope="col"
                className="px-6 py-4 font-semibold text-gray-700"
              >
                Price
              </th>

              <th
                scope="col"
                className="px-6 py-4 font-semibold text-gray-700"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {cartitems?.products.map((product) => (
              <tr
                key={product.product.id}
                className="border-b border-gray-100 hover:bg-green-50 transition-all duration-300"
              >
                <td className="p-4">
                  <img
                    src={product.product.imageCover}
                    className="w-20 h-20 object-cover rounded-xl border border-green-100"
                    alt={product.product.title}
                  />
                </td>

                <td className="px-6 py-4">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">
                    {product.product.title}
                  </h3>
                </td>

                <td className="px-6 py-4">
                  <form className="max-w-xs">
                    <div className="inline-flex items-center gap-3 bg-green-50 border border-green-100 rounded-full px-3 py-2">
                      <button
                        onClick={() =>
                          updateCartProducts(
                            product.product.id,
                            product.count - 1
                          )
                        }
                        type="button"
                        id="decrement-button-1"
                        className="flex items-center justify-center bg-white border border-green-200 hover:bg-green-600 hover:text-white transition-all rounded-full h-8 w-8"
                      >
                        <svg
                          className="w-3 h-3"
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

                      <span className="font-bold text-gray-700 min-w-5 text-center">
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
                        id="increment-button-1"
                        className="flex items-center justify-center bg-white border border-green-200 hover:bg-green-600 hover:text-white transition-all rounded-full h-8 w-8"
                      >
                        <svg
                          className="w-3 h-3"
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
                  </form>
                </td>

                <td className="px-6 py-4">
                  <span className="font-bold text-green-600 text-base">
                    {product.price} EGP
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    onClick={() =>
                      deleteCartProducts(product.product.id)
                    }
                    className="font-medium text-red-500 cursor-pointer hover:text-red-700 hover:underline transition"
                  >
                    Remove
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-5 border-t border-green-100 bg-green-50/40">
          <h3 className="text-center text-2xl font-bold text-gray-700 mb-5">
            Total Price:
            <span className="text-green-600 ml-2">
              {cartitems?.totalCartPrice} EGP
            </span>
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={emptyCartProducts}
              className="flex-1 bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white py-3 rounded-xl font-medium transition-all duration-300"
            >
              Empty Cart
            </button>

            <Link
              to="/checkout"
              className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Check Out
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}