import Button from "../ui/Button";

/** Prev/Next server pagination for the products grid. */
export default function ProductsPagination({
  page,
  numberOfPages,
  onPageChange,
}) {
  if (numberOfPages <= 1) return null;

  return (
    <nav
      aria-label="Product pages"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        Prev
      </Button>

      <span className="px-3 text-sm font-medium text-muted">
        Page {page} of {numberOfPages}
      </span>

      <Button
        variant="outline"
        disabled={page >= numberOfPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next
      </Button>
    </nav>
  );
}
