import { useContext } from "react";
import { useFormik } from "formik";
import { CartContext } from "../../Context/CartContext";

export default function Checkout() {
  const { checkOutNow } = useContext(CartContext);

  async function handleCheckout() {
    const cartId = localStorage.getItem("cartId");

    const url = window.location.origin;

    const response = await checkOutNow(
      cartId,
      url,
      formik.values
    );

    if (response.data.status === "success") {
      window.location.href = response.data.session.url;
    }
  }

  const formik = useFormik({
    initialValues: {
      details: "",
      phone: "",
      city: "",
    },
    onSubmit: handleCheckout,
  });

  return (
    <>
      <div className="mx-auto py-20">
        <h2 className="font-bold text-4xl text-green-600">
          Pay Now
        </h2>

        <form
          onSubmit={formik.handleSubmit}
          className="max-w-md mx-auto py-5"
        >
          {/* Details */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={formik.values.details}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              name="details"
              id="details"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />

            <label
              htmlFor="details"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Details
            </label>
          </div>

          {/* City */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={formik.values.city}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              name="city"
              id="city"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />

            <label
              htmlFor="city"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your City
            </label>
          </div>

          {/* Phone */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={formik.values.phone}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              name="phone"
              id="phone"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />

            <label
              htmlFor="phone"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Phone
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none"
          >
            Check Out
          </button>
        </form>
      </div>
    </>
  );
}