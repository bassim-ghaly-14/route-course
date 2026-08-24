import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { createCheckoutSession } from "../../api/cart";
import { useCart } from "../../hooks/useCart";
import { getApiErrorMessage } from "../../api/apiError";
import toast from "react-hot-toast";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorState from "../ui/ErrorState";
import { formatPrice } from "../../lib/format";

export default function Checkout() {
  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartError,
    refetch: refetchCart,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = Yup.object().shape({
    details: Yup.string().required("Details are required"),
    city: Yup.string().required("City is required"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
  });

  async function handleCheckout(values) {
    if (loading) return; // guard against duplicate submissions

    const url = window.location.origin;

    try {
      setLoading(true);

      // Cart server-state comes from the shared ['cart'] query — no
      // localStorage side effects. Direct navigation to /checkout is safe.
      const cartId = cartData?.cartId;
      const itemCount = cartData?.numOfCartItems ?? 0;

      if (!cartId || itemCount === 0) {
        toast.error("Your cart is empty. Add products before checking out.");
        navigate("/products");
        return;
      }

      const response = await createCheckoutSession(cartId, url, values);

      if (response?.status === "success" && response.session?.url) {
        window.location.href = response.session.url;
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, "Checkout failed. Please try again."));
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

  if (cartLoading) {
    return (
      <div className="py-20 text-center font-bold text-primary-700">
        Loading your cart...
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="page-container py-16">
        <ErrorState
          message="Failed to load your cart. Please try again."
          onRetry={() => refetchCart()}
          className="min-h-[50vh]"
        />
      </div>
    );
  }

  return (
    <div className="page-container py-16 sm:py-20">
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
        {/* Shipping form */}
        <div className="card p-6 sm:p-8">
          <h1 className="section-header mb-2">
            Pay Now
          </h1>

          <p className="mb-6 text-sm text-muted">
            Enter your shipping details to continue to secure payment.
          </p>

        <form onSubmit={formik.handleSubmit} noValidate>

          <Input
            name="details"
            label="Enter Your Details"
            autoComplete="street-address"
            value={formik.values.details}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.details ? formik.errors.details : undefined}
          />

          <Input
            name="city"
            label="Enter Your City"
            autoComplete="address-level2"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.city ? formik.errors.city : undefined}
          />

          <Input
            name="phone"
            label="Enter Your Phone"
            type="tel"
            autoComplete="tel"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone ? formik.errors.phone : undefined}
          />

          <Button type="submit" loading={loading} size="lg" className="mt-4 w-full">
            {loading ? "Redirecting..." : "Check Out"}
          </Button>

        </form>
        </div>

        {/* Order summary (read-only, from the shared cart cache) */}
        <aside className="card h-fit p-6 sm:p-8" aria-label="Order summary">
          <h2 className="mb-4 text-lg font-bold text-strong">Order Summary</h2>

          <ul className="divide-y divide-line">
            {cartData?.data?.products?.map((item) => (
              <li
                key={item.product.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-lg border border-line object-cover"
                  />
                  <span className="truncate text-sm font-medium text-strong">
                    {item.product.title}
                  </span>
                </div>

                <span className="shrink-0 text-sm font-semibold text-muted">
                  ×{item.count}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-primary-100 pt-4">
            <span className="font-semibold text-strong">Total</span>

            <span className="text-xl font-extrabold text-primary-700">
              {formatPrice(cartData?.data?.totalCartPrice)}
            </span>
          </div>

          <p className="mt-2 text-xs text-muted">
            Final amount is confirmed on the secure payment page.
          </p>
        </aside>
      </div>
    </div>
  );
}