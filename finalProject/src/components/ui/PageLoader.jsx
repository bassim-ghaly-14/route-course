/**
 * Shared Suspense fallback for lazily-loaded routes. Announces loading to
 * assistive tech and keeps a stable min-height so route switches don't jump.
 */
export default function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] items-center justify-center"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"
        />
        <span className="text-sm font-medium text-muted">Loading…</span>
      </div>
    </div>
  );
}
