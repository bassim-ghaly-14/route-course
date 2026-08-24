import useOnlineStatus from '../../hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  // Anchored to the BOTTOM of the viewport: the Navbar is fixed to the top
  // with its own z-index/height system (--navbar-height), and a top banner
  // would either cover it or force a layout jump. A bottom status strip
  // never conflicts with the Navbar at any breakpoint.
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-60 bg-red-600 py-2 text-center text-white"
    >
      You are offline — some features may be unavailable.
    </div>
  );
}