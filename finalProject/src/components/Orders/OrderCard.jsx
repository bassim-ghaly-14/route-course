import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faBox,
  faCircleCheck,
  faClock,
  faTruck,
} from '@fortawesome/free-solid-svg-icons';

import Badge from '../ui/Badge';
import { formatPrice } from '../../lib/format';

/**
 * One order card on the My Orders page. The whole card is a semantic
 * <Link> to orders/:id, matching RecentOrderRow on the Profile page.
 *
 * The Route API exposes only isPaid / isDelivered flags — payment and
 * delivery states are derived from those (no invented backend states).
 */
export default function OrderCard({ order }) {
  const placedAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const itemCount =
    order.cartItems?.reduce((sum, item) => sum + (item.count || 0), 0) ?? null;

  return (
    <Link
      to={`/orders/${order._id}`}
      state={{ order }}
      aria-label={`View order #${order._id.slice(-6)}, placed ${placedAt || 'recently'}`}
      className="
        group block rounded-2xl border border-line bg-surface shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600
      "
    >
      <div className="p-5 sm:p-6">
        {/* Top row: identity + status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-strong">
              <FontAwesomeIcon icon={faBox} aria-hidden="true" className="mr-2 text-primary-600" />
              Order #{order._id.slice(-6)}
            </h2>
            {placedAt && (
              <p className="mt-1 text-sm text-muted">Placed on {placedAt}</p>
            )}
          </div>

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

        {/* Bottom row: total + items + action */}
        <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Order total
            </p>
            <p className="text-xl font-black text-primary-600 sm:text-2xl">
              {formatPrice(order.totalOrderPrice)}
            </p>
            {itemCount !== null && (
              <p className="mt-1 text-sm text-muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                {order.shippingAddress?.city
                  ? ` · Ship to ${order.shippingAddress.city}`
                  : ''}
              </p>
            )}
          </div>

          <span className="inline-flex shrink-0 items-center gap-2 rounded-xl px-1 py-2 text-sm font-semibold text-primary-700 transition-colors group-hover:text-primary-800">
            View order
            <FontAwesomeIcon
              icon={faArrowRight}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
