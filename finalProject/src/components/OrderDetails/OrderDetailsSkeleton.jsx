/**
 * Skeleton shaped like the final Order Details layout to avoid layout
 * jumping while useOrder resolves the order from the shared cache.
 */
export default function OrderDetailsSkeleton() {
  return (
    <section
      className="page-container py-8 sm:py-10"
      aria-busy="true"
      aria-label="Loading order"
    >
      <div className="animate-pulse">
        {/* Breadcrumb */}
        <div className="h-4 w-48 rounded bg-gray-100" />

        {/* Header */}
        <div className="mt-5 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
          <div className="h-8 w-56 max-w-full rounded-lg bg-gray-200" />
          <div className="mt-3 h-4 w-40 max-w-full rounded bg-gray-100" />
          <div className="mt-4 flex gap-2">
            <div className="h-8 w-28 rounded-full bg-gray-100" />
            <div className="h-8 w-32 rounded-full bg-gray-100" />
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Items */}
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
            <div className="h-6 w-32 rounded bg-gray-200" />
            <div className="mt-6 space-y-5">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 rounded-xl bg-gray-200" />
                  <div className="w-full space-y-2 py-1">
                    <div className="h-4 w-3/4 max-w-full rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-100" />
                    <div className="h-4 w-24 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary / payment / shipping */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
              <div className="h-6 w-36 rounded bg-gray-200" />
              <div className="mt-5 space-y-3">
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
              </div>
              <div className="mt-5 h-7 w-40 rounded bg-gray-200" />
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
              <div className="h-6 w-44 rounded bg-gray-200" />
              <div className="mt-5 h-4 w-full rounded bg-gray-100" />
              <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
              <div className="h-6 w-40 rounded bg-gray-200" />
              <div className="mt-5 space-y-3">
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
                <div className="h-4 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
