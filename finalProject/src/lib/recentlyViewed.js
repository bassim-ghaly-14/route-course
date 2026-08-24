const STORAGE_KEY = 'trado.recentlyViewed';
const MAX_ITEMS = 8;

/**
 * Lightweight recently-viewed tracking. Stores ONLY minimal display fields
 * (never full payloads, never anything auth-related). All reads/writes are
 * guarded so malformed or unavailable localStorage can never break the UI.
 */
function safeRead() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item && typeof item._id === 'string'
    );
  } catch {
    return [];
  }
}

function safeWrite(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage full/unavailable — recently-viewed is best-effort only */
  }
}

export function getRecentlyViewed() {
  return safeRead();
}

/** Records a product view: deduped, most-recent-first, capped at MAX_ITEMS. */
export function recordRecentlyViewed(product) {
  if (!product?._id) return;
  const current = safeRead().filter((item) => item._id !== product._id);
  current.unshift({
    _id: product._id,
    title: product.title,
    imageCover: product.imageCover,
    price: product.price,
    ratingsAverage: product.ratingsAverage,
    category: product.category?.name,
  });
  safeWrite(current.slice(0, MAX_ITEMS));
}
