import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CartContext } from "../../Context/CartContext";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Checkout() {
  const { checkOutNow } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const validate = Yup.object().shape({
    details: Yup.string().required("Details are required"),
    city: Yup.string().required("City is required"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
  });

  async function handleCheckout(values) {
    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
      toast.error("Your cart could not be found. Please revisit your cart.");
      return;
    }

    const url = window.location.origin;

    try {
      setLoading(true);

      const response = await checkOutNow(cartId, url, values);

      if (response?.data?.status === "success" && response.data.session?.url) {
        window.location.href = response.data.session.url;
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      details: "",
      phone: "",
      city: "",
    },
    validationSchema: validate,
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

          {formik.errors.details && formik.touched.details ?
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
              {formik.errors.details}
            </div> : null
          }

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

          {formik.errors.city && formik.touched.city ?
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
              {formik.errors.city}
            </div> : null
          }

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

          {formik.errors.phone && formik.touched.phone ?
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
              {formik.errors.phone}
            </div> : null
          }

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              'Check Out'
            )}
          </button>
        </form>
      </div>
    </>
  );
}
