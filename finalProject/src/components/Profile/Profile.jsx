import { useEffect, useState, useContext } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { CartContext } from "../../Context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileSkeleton from "./ProfileSkeleton";
import {
  faCartShopping,
  faBox,
  faBoxOpen,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const { cartItemsCount } = useContext(CartContext);

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("userToken");
  const user = token ? jwtDecode(token) : null;

  async function getOrders() {
    try {
      setLoading(true);

      const token = localStorage.getItem("userToken");
      const user = token ? jwtDecode(token) : null;

      const userId =
        localStorage.getItem("userId") ||
        user?.id ||
        user?._id ||
        user?.userId ||
        user?.sub;

      if (!userId) {
        setOrders([]);
        setTotalOrders(0);
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(`/orders/user/${userId}`);

      const ordersData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setOrders(ordersData);
      setTotalOrders(ordersData.length);
    } catch (err) {
      console.error(err);
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      getOrders();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const latestOrders = [...orders]
  .reverse()
  .slice(0, 3);

  if (loading) {
  return <ProfileSkeleton />;
  }

  return (
    <section className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            <div>
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm">
                Premium Member
              </span>

              <h1 className="text-4xl md:text-6xl font-black text-white mt-5">
                Welcome Back
              </h1>

              <p className="text-green-100 mt-3 text-lg">
                {user?.name || user?.email}
              </p>
            </div>

            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-lg border-4 border-white/30 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
              {(user?.name || user?.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 -mt-12 relative z-20">

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="group bg-white rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-green-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faCartShopping} className="text-green-600" />
                  Cart Items
                </p>

                <h2 className="text-5xl font-black text-green-600 mt-2">
                  {cartItemsCount}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 text-2xl shadow-sm group-hover:scale-110 transition">
                <FontAwesomeIcon icon={faCartShopping} />
              </div>

            </div>
          </div>

          {/* Total Orders */}
          <div className="group bg-white rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-blue-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faBox} className="text-blue-600" />
                  Total Orders
                </p>

                <h2 className="text-5xl font-black text-blue-600 mt-2">
                  {totalOrders}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl shadow-sm group-hover:scale-110 transition">
                <FontAwesomeIcon icon={faBox} />
              </div>

            </div>
          </div>

          {/* Account Status */}
          <div className="group bg-white rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-emerald-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600" />
                  Account Status
                </p>

                <h2 className="text-3xl font-black text-emerald-600 mt-3 flex items-center gap-2">
                  Active
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl shadow-sm group-hover:scale-110 transition">
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>

            </div>
          </div>

        </div>

        {/* Latest Orders */}
        <div className="mt-10 bg-white rounded-[32px] shadow-xl overflow-hidden">

          <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">
              Latest Orders
            </h2>
            <p className="text-green-100 mt-1">
              Recent activity on your account
            </p>
          </div>

          <div className="p-8">
            {latestOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-4 text-green-600">
                <FontAwesomeIcon icon={faBoxOpen} />
              </div>
              <h3 className="text-2xl font-bold text-gray-700">
                No Orders Yet
              </h3>
              <p className="text-gray-500 mt-2">
                Your future orders will appear here.
              </p>
            </div> 
            ) : (
               <div className="space-y-5">
                {latestOrders.map((order) => (
                  <div
                    key={order._id}
                    className="group border border-gray-100 rounded-3xl p-5 hover:border-green-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

                      <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-xl font-bold">
                          #
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-800">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {order.paymentMethodType}
                          </p>
                        </div>

                      </div>

                      <div className="flex items-center gap-4">

                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          order.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>

                        <div className="text-right">
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-black text-xl text-green-600">
                            {order.totalOrderPrice} EGP
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}