/** Consistent currency formatting across cart, checkout, cards, orders.
 *  Presentation-only: nullish/non-numeric values render as an em dash,
 *  integers keep the compact "1,234 EGP" form, and fractional prices show
 *  up to two decimals instead of being silently truncated. */
export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '—';

  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';

  const maximumFractionDigits = Number.isInteger(amount) ? 0 : 2;

  return `${amount.toLocaleString('en-US', { maximumFractionDigits })} EGP`;
}
