import useOnlineStatus from '../../hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-red-600 text-white text-center py-2 fixed top-0 left-0 right-0 z-50">
      You are offline
    </div>
  );
}