export default function ProductsSkeleton() {
  return (
    <div className="container mx-auto px-10 py-8">
      <h2 className="text-2xl font-bold mb-6 text-green-600">
        Category Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg shadow overflow-hidden animate-pulse"
          >
            <div className="w-full h-40 bg-gray-200"></div>

            <div className="p-2 space-y-2">
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>

              <div className="flex justify-between mt-3">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-3 w-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}