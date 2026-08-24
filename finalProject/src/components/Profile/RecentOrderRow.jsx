import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Badge from "../ui/Badge";
import { formatPrice } from "../../lib/format";

/** One compact recent-order row on the Profile page. Links to the
    existing order-details route, passing the order via state exactly
    like the Orders page does. */
export default function RecentOrderRow({ order }) {
  const placedAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      to={`/orders/${order._id}`}
      state={{ order }}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm transition-all duration-300 hover:border-primary-200 hover:shadow-md sm:p-5"
    >
      <div className="min-w-0">
        <h3 className="truncate font-bold text-strong">
          Order #{order._id.slice(-6)}
        </h3>
        <p className="text-sm text-muted">
          {[placedAt, order.paymentMethodType].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <div className="hidden text-right sm:block">
          <Badge tone={order.isPaid ? "success" : "warning"}>
            {order.isPaid ? "Paid" : "Pending"}
          </Badge>
        </div>

        <p className="font-black text-primary-600">
          {formatPrice(order.totalOrderPrice)}
        </p>

        <FontAwesomeIcon
          icon={faChevronRight}
          aria-hidden="true"
          className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-600"
        />
      </div>
    </Link>
  );
}
