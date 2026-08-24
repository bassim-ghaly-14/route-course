import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCircleCheck,
  faClock,
  faCreditCard,
  faLocationDot,
  faPhone,
  faTruck,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import useOrder from '../../hooks/useOrder';
import { formatPrice } from '../../lib/format';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import ErrorState from '../ui/ErrorState';
import OrderDetailsSkeleton from './OrderDetailsSkeleton';

/**
 * Order Details — resolved client-side by useOrder() from the shared
 * user-orders cache (the API has no GET /orders/:id endpoint). The router
 * state passed by OrderCard/RecentOrderRow makes the fast path free.
 *
 * Status semantics intentionally mirror OrderCard on /orders: payment is
 * Paid/Pending (isPaid), delivery is Delivered/Processing (isDelivered).
 */

function InfoRow({ icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          aria-hidden="true"
          className="mt-1 text-primary-600"
        />
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        <p className="wrap-break-word font-medium text-strong">{value}</p>
      </div>
    </div>
  );
}

export default function OrderDetails() {
  const { id } = useParams();
  const { data: order, isLoading, isError, refetch } = useOrder(id);

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return (
      <section className="page-container py-8 sm:py-10">
        {isError ? (
          <ErrorState
            message="We couldn't load this order. Please try again."
            onRetry={refetch}
          />
        ) : (
          <ErrorState message="Order not found." />
        )}

        <div className="-mt-8 flex justify-center">
          <Link to="/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </section>
    );
  }

  const placedAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const items = order.cartItems ?? [];
  // Subtotal is derived from real line items — the API exposes no separate
  // shipping/tax/discount fields, so none are shown.
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.count || 0),
    0
  );
  const itemCount = items.reduce((sum, item) => sum + (item.count || 0), 0);
  const address = order.shippingAddress;
  const addressDetails = [address?.city, address?.details]
    .filter(Boolean)
    .join(' · ');

  return (
    <section className="page-container py-8 sm:py-10">
      {/* Header */}
      <header>
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Orders', to: '/orders' },
            { label: `Order #${order._id.slice(-6)}` },
          ]}
        />

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black tracking-tight text-primary-700 sm:text-3xl">
                Order #{order._id.slice(-6)}
              </h1>
              {placedAt && (
                <p className="mt-1 text-muted">Placed on {placedAt}</p>
              )}
              <p className="mt-0.5 text-sm text-muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>

            {/* Same status interpretation as OrderCard on /orders */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={order.isPaid ? 'success' : 'warning'}>
                <FontAwesomeIcon
                  icon={order.isPaid ? faCircleCheck : faClock}
                  aria-hidden="true"
                  className="mr-1.5 text-xs"
                />
                Payment · {order.isPaid ? 'Paid' : 'Pending'}
              </Badge>

              <Badge tone={order.isDelivered ? 'info' : 'neutral'}>
                <FontAwesomeIcon
                  icon={faTruck}
                  aria-hidden="true"
                  className="mr-1.5 text-xs"
                />
                {order.isDelivered ? 'Order · Delivered' : 'Order · Processing'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Order items */}
        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-strong">Order Items</h2>

          <ul className="mt-5 divide-y divide-line">
            {items.map((item) => (
              <li key={item._id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <img
                  src={item.product?.imageCover}
                  alt={item.product?.title || 'Product'}
                  loading="lazy"
                  className="h-20 w-20 shrink-0 rounded-xl border border-line object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold leading-snug text-strong">
                    {item.product?.title || 'Product'}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    Qty {item.count} × {formatPrice(item.price)}
                  </p>

                  {/* Line total on mobile */}
                  <p className="mt-2 font-bold text-primary-600 lg:hidden">
                    {formatPrice((item.price || 0) * (item.count || 0))}
                  </p>
                </div>

                {/* Line total on desktop */}
                <p className="hidden shrink-0 self-center font-bold text-primary-600 lg:block">
                  {formatPrice((item.price || 0) * (item.count || 0))}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary + payment + shipping */}
        <div className="space-y-6">
          {/* Totals */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-strong">Order Summary</h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Items ({itemCount})</dt>
                <dd className="font-medium text-strong">
                  {formatPrice(subtotal)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
              <span className="font-bold text-strong">Total</span>
              <span className="text-xl font-black text-primary-600 sm:text-2xl">
                {formatPrice(order.totalOrderPrice)}
              </span>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-strong">
              Payment Information
            </h2>

            <div className="mt-5 space-y-4">
              {order.paymentMethodType && (
                <InfoRow
                  icon={faCreditCard}
                  label="Payment method"
                  value={
                    order.paymentMethodType === 'cash'
                      ? 'Cash on delivery'
                      : order.paymentMethodType
                  }
                />
              )}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Payment status
                </p>
                <div className="mt-1.5">
                  <Badge tone={order.isPaid ? 'success' : 'warning'}>
                    <FontAwesomeIcon
                      icon={order.isPaid ? faCircleCheck : faClock}
                      aria-hidden="true"
                      className="mr-1.5 text-xs"
                    />
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping */}
          {(addressDetails || order.user?.name) && (
            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-bold text-strong">
                Shipping Information
              </h2>

              <div className="mt-5 space-y-4">
                <InfoRow icon={faUser} label="Name" value={order.user?.name} />
                <InfoRow
                  icon={faPhone}
                  label="Phone"
                  value={order.user?.phone}
                />
                <InfoRow
                  icon={faLocationDot}
                  label="Address"
                  value={addressDetails}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Link to="/orders" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Back to Orders
          </Button>
        </Link>

        <Link to="/products" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Continue Shopping</Button>
        </Link>
      </div>
    </section>
  );
}
