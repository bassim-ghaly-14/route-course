export default function ProductsSkeleton() {
  return (
    <section className="py-10 container mx-auto px-10 animate-pulse">
      <div className="h-8 w-40 bg-gray-200 rounded-xl mb-6"></div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="
            overflow-hidden
            rounded-2xl
            bg-white
            border border-gray-100
            shadow-md
            "
          >
            {/* Image */}
            <div className="w-full h-60 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>

            {/* Content */}
            <div className="p-3">

              <div className="h-4 w-20 bg-gray-200 rounded mb-3"></div>

              <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>

              <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>

              <div className="flex justify-between items-center">

                <div className="h-5 w-20 bg-gray-200 rounded"></div>

                <div className="h-5 w-12 bg-gray-200 rounded"></div>

              </div>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
}