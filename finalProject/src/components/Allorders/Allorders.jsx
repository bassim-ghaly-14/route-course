import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCircleCheck,
  faMoneyBillTrendUp,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

export default function Allorders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  async function getUserOrders() {
    try {
      setLoading(true);

const token = localStorage.getItem("userToken");

const user = token ? jwtDecode(token) : null;

const userId =
  localStorage.getItem("userId") ||
  user?._id ||
  user?.id ||
  user?.userId ||
  user?.sub;

if (!userId) {
  throw new Error("User ID not found");
}

const url = `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`;
      const { data } = await axios.get(url, {
        headers: { token },
      });

      const ordersData = Array.isArray(data)
  ? data
  : data?.data || [];

setOrders([...ordersData].reverse());
      console.log("Fetched orders:", data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserOrders();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-green-600 font-bold text-lg">
          Loading your orders...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl shadow-sm">
          {error}
        </div>
      </section>
    );
  }

  if (!orders.length) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            Orders History
          </h2>
          <p className="text-gray-500">
            You don’t have any orders yet.
          </p>
        </div>
      </section>
    );
  }

const totalOrders = orders.length;

const paidOrders = orders.filter(
  (order) => order.isPaid
).length;

const totalSpent = orders.reduce(
  (sum, order) => sum + (order.totalOrderPrice || 0),
  0
);
const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

const currentOrders = orders.slice(
  indexOfFirstOrder,
  indexOfLastOrder
);

const totalPages = Math.ceil(
  orders.length / ordersPerPage
);
  return (
    <section className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-green-600">
            Orders History
          </h2>

          <p className="text-gray-500 mt-2">
            Track all your purchases in one place
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* Total Orders */}
          <div className="group bg-white rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-medium">
                  Total Orders
                </p>

                <h3 className="text-5xl font-black text-green-600 mt-3">
                  {totalOrders}
                </h3>

                <p className="text-xs text-gray-400 mt-2">
                  Orders placed so far
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 text-2xl group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faBox} />
              </div>

            </div>

          </div>

          {/* Paid Orders */}
          <div className="group bg-white rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-medium">
                  Paid Orders
                </p>

                <h3 className="text-5xl font-black text-blue-600 mt-3">
                  {paidOrders}
                </h3>

                <p className="text-xs text-gray-400 mt-2">
                  Successfully completed
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>

            </div>

          </div>

          {/* Total Spent */}
          <div className="group bg-white rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-medium">
                  Total Spent
                </p>

                <h3 className="text-4xl font-black text-emerald-600 mt-3">
                  {totalSpent.toLocaleString()}
                </h3>

                <p className="text-xs text-gray-400 mt-2">
                  Egyptian Pounds
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faMoneyBillTrendUp} />
              </div>

            </div>

          </div>

        </div>

        <div className="space-y-6">
          {currentOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-50 to-white border-b">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">
                    #{order._id.slice(-8)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-green-600">
                    {order.totalOrderPrice} EGP
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-3">
                <div className="flex flex-wrap gap-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending Payment"}
                  </span>

                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {order.paymentMethodType || "Cash / Card"}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">
                    City:
                  </span>{" "}
                  {order.shippingAddress?.city || "N/A"}

                  <p className="font-medium text-gray-800">
                    Date:
                    <span className="text-xs text-gray-500 px-1">
                      {new Date(order.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">
                      Items:
                    </span>{" "}
                    {order.cartItems?.length || 0}
                  </p>
                </div>

                {/* Products */}
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Products
                  </h4>

                  <div className="divide-y">
                    {order.cartItems?.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between py-2 text-sm"
                      >
                        <span className="text-gray-700">
                          {item.product?.title}
                        </span>

                        <span className="font-semibold text-gray-900">
                          x{item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer accent */}
              <div className="px-6 pb-5">
                <Link
                  to={`/order/${order._id}`}
                  state={{ order }}
                  className="
                  inline-flex items-center gap-2
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-5 py-2.5
                  rounded-xl
                  font-semibold
                  transition-all duration-300
                  shadow-md hover:shadow-lg"
                >
                  View Details
                </Link>
              </div>
              <div className="h-1 bg-gradient-to-r from-green-400 to-green-600" />
              
            </div>
          ))}
        </div>
        {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-10">

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.max(prev - 1, 1)
        )
      }
      disabled={currentPage === 1}
      className="
      flex items-center gap-2
      px-5 py-2.5
      rounded-xl
      bg-green-600
      text-white
      font-semibold
      shadow-md
      hover:bg-green-700
      hover:shadow-lg
      active:scale-95
      transition-all duration-300
      disabled:bg-gray-200
      disabled:text-gray-400
      disabled:shadow-none
      disabled:cursor-not-allowed
      cursor-pointer"
    >
      <FontAwesomeIcon icon={faChevronLeft} />
      Prev
    </button>

{[...Array(totalPages)].map((_, index) => (
  <button
    key={index}
    onClick={() => setCurrentPage(index + 1)}
    className={`w-11 h-11 rounded-xl font-bold cursor-pointer transition-all duration-300 border ${
      currentPage === index + 1
        ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-200 scale-110"
        : "bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
    }`}
  >
    {index + 1}
  </button>
))}

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }
      disabled={currentPage === totalPages}
      className="
      flex items-center gap-2
      px-5 py-2.5
      rounded-xl
      bg-green-600
      text-white
      font-semibold
      shadow-md
      hover:bg-green-700
      hover:shadow-lg
      active:scale-95
      transition-all duration-300
      disabled:bg-gray-200
      disabled:text-gray-400
      disabled:shadow-none
      disabled:cursor-not-allowed
      cursor-pointer"
    >
      <FontAwesomeIcon icon={faChevronRight} />
      Next
    </button>

  </div>
)}
      </div>
    </section>
  );
}