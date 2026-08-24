const PAGE_SIZE = 5;

/** Skeleton cards shaped like the final layout to prevent layout jumping.
    Uses the same animate-pulse approach as the other page skeletons. */
export default function OrdersSkeleton() {
  return (
    <section className="page-container py-8 sm:py-10" aria-busy="true" aria-label="Loading your orders">
      {/* Header placeholder */}
      <div className="mb-8 animate-pulse">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="mt-4 h-9 w-48 rounded-lg bg-gray-200 sm:w-64" />
        <div className="mt-3 h-4 w-64 max-w-full rounded bg-gray-100 sm:w-80" />
      </div>

      <div className="mx-auto max-w-4xl space-y-4">
        {Array.from({ length: PAGE_SIZE }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6"
          >
            <div className="animate-pulse">
              <div className="flex items-start justify-between gap-4">
                <div className="w-full space-y-2 sm:max-w-xs">
                  <div className="h-5 w-40 max-w-full rounded bg-gray-200" />
                  <div className="h-4 w-28 max-w-full rounded bg-gray-100" />
                </div>
                <div className="flex shrink-0 gap-2">
                  <div className="h-8 w-24 rounded-full bg-gray-100" />
                  <div className="hidden h-8 w-28 rounded-full bg-gray-100 sm:block" />
                </div>
              </div>
              <div className="h-4 w-48 max-w-full rounded bg-gray-100 mt-3" />
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <div className="h-7 w-24 rounded bg-gray-200" />
                <div className="h-6 w-24 rounded-xl bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
