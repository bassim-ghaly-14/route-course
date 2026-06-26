export default function SliderSkeleton() {
  return (
    <div className="my-10">
      <h2 className="text-green-600 text-2xl font-bold mb-6">
        Shop Popular Categories
      </h2>

      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="text-center w-28 flex-shrink-0 animate-pulse"
          >
            <div className="w-28 h-28 rounded-full border-2 border-gray-200 bg-gray-200"></div>

            <div className="h-3 bg-gray-200 rounded mt-3 w-3/4 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}