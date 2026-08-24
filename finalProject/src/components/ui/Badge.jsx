const TONES = {
  success: 'bg-primary-100 text-primary-700',
  warning: 'bg-amber-100 text-warning',
  neutral: 'bg-gray-100 text-muted',
  info: 'bg-primary-50 text-primary-700 ring-1 ring-primary-200',
};

/** Small status pill used across orders / profile surfaces. */
export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-semibold ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}