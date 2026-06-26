import { useLocation, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
faBox,
faCreditCard,
faTruck,
faCircleCheck,
faClock,
faUser,
faEnvelope,
faPhone,
faLocationDot,
faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';

export default function OrderDetails() {
const { state } = useLocation();

const order = state?.order;

if (!order) {
  return <Navigate to="/allorders" replace />;
}

return <>
    <section className="container mx-auto px-6 py-10">
        <h2 className="text-green-600 text-2xl font-bold mb-6">
            Order Details
        </h2>
    {/* Header */}
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <p className="text-gray-500 text-sm">
            Order ID
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-green-600">
            #{order._id.slice(-8)}
          </h1>

          <p className="text-gray-500 mt-2">
            {new Date(order.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              order.isPaid
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            <FontAwesomeIcon
              icon={order.isPaid ? faCircleCheck : faClock}
              className="mr-2"
            />

            {order.isPaid ? "Paid" : "Pending Payment"}
          </span>

          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
            <FontAwesomeIcon
              icon={faCreditCard}
              className="mr-2"
            />

            {order.paymentMethodType}
          </span>

        </div>

      </div>

    </div>

    {/* Stats */}
    <div className="grid md:grid-cols-3 gap-6 mb-8">

      <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center">

          <div>
            <p className="text-gray-500">
              Total Price
            </p>

            <h3 className="text-4xl font-black text-green-600 mt-2">
              {order.totalOrderPrice} EGP
            </h3>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 text-2xl">
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>

        </div>
      </div>

      <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center">

          <div>
            <p className="text-gray-500">
              Items
            </p>

            <h3 className="text-4xl font-black text-blue-600 mt-2">
              {order.cartItems?.length}
            </h3>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">
            <FontAwesomeIcon icon={faBox} />
          </div>

        </div>
      </div>

      <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center">

          <div>
            <p className="text-gray-500">
              Delivery
            </p>

            <h3 className="text-2xl font-black text-emerald-600 mt-2">
              {order.isDelivered
                ? "Delivered"
                : "Preparing"}
            </h3>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl">
            <FontAwesomeIcon icon={faTruck} />
          </div>

        </div>
      </div>

    </div>

    {/* Customer Info */}
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">

      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Customer Information
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faUser}
            className="text-green-600"
          />

          <span>{order.user?.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="text-green-600"
          />

          <span>{order.user?.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faPhone}
            className="text-green-600"
          />

          <span>{order.user?.phone}</span>
        </div>

        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faLocationDot}
            className="text-green-600"
          />

          <span>
            {order.shippingAddress?.city || "N/A"}
          </span>
        </div>

      </div>

    </div>

    {/* Timeline */}
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">

      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Order Timeline
      </h2>

      <div className="space-y-4">

        <div className="flex items-center gap-4 text-green-600">
          <FontAwesomeIcon icon={faCircleCheck} />
          <span>Order Created</span>
        </div>

        <div
          className={`flex items-center gap-4 ${
            order.isPaid
              ? "text-green-600"
              : "text-yellow-600"
          }`}
        >
          <FontAwesomeIcon
            icon={order.isPaid ? faCircleCheck : faClock}
          />

          <span>
            {order.isPaid
              ? "Payment Completed"
              : "Waiting For Payment"}
          </span>
        </div>

        <div
          className={`flex items-center gap-4 ${
            order.isDelivered
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          <FontAwesomeIcon icon={faTruck} />

          <span>
            {order.isDelivered
              ? "Delivered"
              : "Preparing Shipment"}
          </span>
        </div>

      </div>

    </div>

    {/* Products */}
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">

      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Products
      </h2>

      <div className="space-y-4">

        {order.cartItems?.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center gap-5 border border-gray-100 rounded-2xl p-4 hover:shadow-md transition"
          >

            <img
              src={item.product?.imageCover}
              alt={item.product?.title}
              className="w-24 h-24 object-cover rounded-xl"
            />

            <div className="flex-1">

              <h3 className="font-bold text-lg">
                {item.product?.title}
              </h3>

              <p className="text-gray-500">
                {item.product?.category?.name}
              </p>

              <p className="text-gray-500">
                Brand: {item.product?.brand?.name}
              </p>

            </div>

            <div className="text-center">

              <p className="font-semibold">
                Qty
              </p>

              <p>{item.count}</p>

            </div>

            <div className="text-green-600 font-black text-xl">
              {item.price} EGP
            </div>

          </div>
        ))}

      </div>

    </div>
    </section>
</>
}