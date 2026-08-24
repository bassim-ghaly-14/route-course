import { useDeferredValue } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../api/products';

/**
 * Product search. The API `keyword` parameter is broken (verified: returns 0
 * results for every query), so search runs client-side over ONE cached
 * full-catalog request (~56 products). The catalog request is shared via
 * ['products', 'all'] and cached with a long staleTime, so typing never
 * triggers extra network requests.
 *
 * Debouncing uses React's useDeferredValue: keystrokes update the input
 * immediately while the (cheaper) filtering work runs on the deferred value,
 * avoiding per-keystroke render/request churn without timer effects.
 */
const MIN_QUERY_LENGTH = 2;

function matchesQuery(product, query) {
  const haystack = [
    product.title,
    product.category?.name,
    product.brand?.name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

export default function useProductSearch(rawQuery) {
  const trimmed = rawQuery.trim();
  const isActive = trimmed.length >= MIN_QUERY_LENGTH;

  // Deferred query: lags behind the raw input during busy renders, giving
  // natural debounce-like behavior with zero effects or timers.
  const deferredQuery = useDeferredValue(trimmed);
  const debouncedQuery =
    deferredQuery.length >= MIN_QUERY_LENGTH ? deferredQuery : '';

  const catalog = useQuery({
    queryKey: ['products', 'all'],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 10,
    // Never fetch the catalog just because the user typed one character.
    enabled: isActive,
  });

  const results =
    isActive && debouncedQuery && catalog.data
      ? catalog.data.filter((product) => matchesQuery(product, debouncedQuery))
      : [];

  return {
    results,
    isSearching:
      isActive && (catalog.isFetching || debouncedQuery !== trimmed),
    isActive,
    isError: catalog.isError,
    refetch: catalog.refetch,
  };
}
