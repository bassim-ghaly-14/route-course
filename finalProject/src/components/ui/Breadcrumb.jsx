import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

/**
 * Semantic breadcrumb navigation. `items` is an array of
 * { label, to? } — the last item is the current page (no link).
 */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 overflow-x-auto">
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <FontAwesomeIcon
                  icon={faChevronRight}
                  aria-hidden="true"
                  className="text-[10px] text-muted"
                />
              )}

              {isLast || !item.to ? (
                <span aria-current={isLast ? 'page' : undefined} className="font-medium text-strong">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="transition hover:text-primary-700 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
