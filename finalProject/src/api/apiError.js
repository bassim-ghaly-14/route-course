/**
 * Extracts a safe, user-facing message from an Axios/API error.
 * Never throws; falls back to the provided default.
 */
export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (typeof error?.response?.data === 'string' && error.response.data) ||
    error?.message ||
    fallback
  );
}