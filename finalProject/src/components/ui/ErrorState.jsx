import Button from './Button';

/** Error state with optional retry — one consistent failure UI. */
export default function ErrorState({ message, onRetry, className = '' }) {
  return (
    <section
      role="alert"
      className={`flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 py-12 text-center ${className}`}
    >
      <p className="font-medium text-error">{message}</p>

      {onRetry ? (
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </section>
  );
}