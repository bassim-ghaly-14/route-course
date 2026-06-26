export default function RecentProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, idx) => (
        <div
          key={idx}
          className="overflow-hidden rounded-lg shadow-md animate-pulse"
        >
          <div className="p-3">
            <div className="w-full aspect-square bg-gray-200 rounded"></div>

            <div className="h-3 bg-gray-200 rounded w-1/3 mt-3"></div>

            <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>

            <div className="flex justify-between items-center mt-3">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-10"></div>
            </div>
          </div>

          <div className="px-3 pb-3">
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}