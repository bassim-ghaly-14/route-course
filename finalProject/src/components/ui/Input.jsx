/**
 * Floating-label text input with accessible error association.
 * Pass `error` (a message string) to mark the field invalid; the message is
 * rendered only when provided, so Formik's touched/errors drive visibility.
 */
export default function Input({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
}) {
  const inputId = id || name;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <div className="group relative z-0 mb-1 w-full">
        <input
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          type={type}
          name={name}
          id={inputId}
          autoComplete={autoComplete}
          placeholder=" "
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : undefined}
          className={`block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-sm text-strong focus:outline-none focus:ring-0 peer ${
            error
              ? 'border-error focus:border-error'
              : 'border-line focus:border-primary-600'
          }`}
        />

        <label
          htmlFor={inputId}
          className={`absolute top-3 origin-left -z-10 -translate-y-6 scale-75 text-sm duration-300 transform inset-s-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:inset-s-0 peer-focus:-translate-y-6 peer-focus:scale-75 ${
            error ? 'text-error' : 'text-muted peer-focus:text-primary-700'
          }`}
        >
          {label}
        </label>
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mb-3 rounded-md bg-red-50 px-2 py-1.5 text-xs font-medium text-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}