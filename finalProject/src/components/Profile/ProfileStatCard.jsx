import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

/**
 * Clickable account shortcut card used on the Profile page.
 * Rendered as a real <Link> so keyboard users get native semantics,
 * and the global :focus-visible outline applies automatically.
 */
export default function ProfileStatCard({
  to,
  icon,
  label,
  count,
  unit,
  actionLabel,
  isLoading = false,
}) {
  return (
    <Link
      to={to}
      className="group flex min-h-44 flex-col justify-between rounded-3xl border border-line bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg active:translate-y-0 sm:p-7"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-2xl text-primary-600 shadow-sm transition-transform duration-300 group-hover:scale-110">
          <FontAwesomeIcon icon={icon} aria-hidden="true" />
        </div>

        {/* Navigation affordance */}
        <FontAwesomeIcon
          icon={faArrowRight}
          aria-hidden="true"
          className="mt-2 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-600"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-muted">{label}</p>

        {isLoading ? (
          <div
            className="mt-2 h-9 w-20 animate-pulse rounded-lg bg-gray-200"
            aria-label={`Loading ${label.toLowerCase()}`}
          />
        ) : (
          <>
            <p className="mt-1 text-4xl font-black text-strong" role="status">
              {count}
              <span className="ml-2 align-middle text-base font-semibold text-muted">
                {unit}
              </span>
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
              {actionLabel}
              <FontAwesomeIcon
                icon={faArrowRight}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
