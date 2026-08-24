import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const VARIANTS = {
  primary:
    'bg-primary-600 text-white shadow-sm hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-4 focus-visible:ring-primary-200',
  outline:
    'border border-primary-200 bg-surface text-primary-700 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-4 focus-visible:ring-primary-200',
  ghost:
    'text-primary-700 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-4 focus-visible:ring-primary-200',
  danger:
    'bg-error text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-4 focus-visible:ring-red-200',
  dangerOutline:
    'border border-red-200 bg-surface text-error hover:bg-red-50 active:bg-red-100 focus-visible:ring-4 focus-visible:ring-red-200',
};

const SIZES = {
  md: 'min-h-11 px-5 py-2.5 text-sm',
  lg: 'min-h-12 px-6 py-3 text-base',
};

/**
 * TRADO button primitive.
 * variant: primary | outline | ghost | danger | dangerOutline
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <FontAwesomeIcon icon={faSpinner} spin aria-hidden="true" />}
      {children}
    </button>
  );
}