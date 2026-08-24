import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faXmark,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

import Button from "../ui/Button";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price: Low → High" },
  { value: "-price", label: "Price: High → Low" },
  // Descending rating = actual "Top Rated" (highest → lowest).
  // The API sort param is passed straight through to the server.
  { value: "-ratingsAverage", label: "Top Rated" },
];

const PRICE_RANGES = [
  { value: "", label: "Any price" },
  { value: "0-500", label: "Under 500 EGP" },
  { value: "500-2000", label: "500 – 2,000 EGP" },
  { value: "2000-6000", label: "2,000 – 6,000 EGP" },
  { value: "6000-", label: "6,000 EGP & above" },
];

/**
 * Products toolbar: search field (icon + clear button), server-side sort
 * select and a collapsible filter panel (category / brand / price range —
 * all real API-supported filters). All state lives in the URL via the
 * onParamChange callback passed from the page.
 */
export default function ProductToolbar({
  query,
  sort,
  categoryId,
  brandId,
  priceRange,
  categories,
  brands,
  hasActiveFilters,
  onParamChange,
  onClearAll,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            type="search"
            aria-label="Search products"
            placeholder="Search products…"
            value={query}
            onChange={(e) => onParamChange("q", e.target.value)}
            onKeyDown={(e) => {
              // State is already live as-you-type; Enter just commits focus.
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-10 text-sm text-strong shadow-sm transition focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100"
          />

          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onParamChange("q", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition hover:bg-primary-50 hover:text-primary-700"
            >
              <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Sort + filter toggle */}
        <div className="flex gap-3">
          <label className="sr-only" htmlFor="sort-select">
            Sort products
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onParamChange("sort", e.target.value)}
            className="min-h-11 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-strong shadow-sm focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="products-filters"
          >
            <FontAwesomeIcon icon={faSliders} aria-hidden="true" />
            Filters
            {hasActiveFilters && (
              <span
                aria-hidden="true"
                className="ml-1 h-2 w-2 rounded-full bg-primary-600"
              />
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div
          id="products-filters"
          className="card mt-3 grid gap-4 p-4 sm:grid-cols-3 sm:p-5"
        >
          <FilterSelect
            id="filter-category"
            label="Category"
            value={categoryId}
            onChange={(v) => onParamChange("category", v)}
            placeholder="All categories"
            options={categories}
          />

          <FilterSelect
            id="filter-brand"
            label="Brand"
            value={brandId}
            onChange={(v) => onParamChange("brand", v)}
            placeholder="All brands"
            options={brands}
          />

          <div>
            <label
              htmlFor="filter-price"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
            >
              Price range
            </label>
            <select
              id="filter-price"
              value={priceRange}
              onChange={(e) => onParamChange("price", e.target.value)}
              className="w-full min-h-11 rounded-xl border border-line bg-surface px-3 text-sm text-strong focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {PRICE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="sm:col-span-3">
              <Button variant="ghost" onClick={onClearAll}>
                Reset all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ id, label, value, onChange, placeholder, options }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-11 rounded-xl border border-line bg-surface px-3 text-sm text-strong focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100"
      >
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}

