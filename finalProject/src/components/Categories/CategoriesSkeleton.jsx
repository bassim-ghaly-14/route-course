export default function CategoriesSkeleton() {
  return (
    <section className="container mx-auto px-6 py-10">

      <div className="h-10 w-72 bg-gray-200 rounded-xl animate-pulse mb-8" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="
            overflow-hidden
            rounded-3xl
            shadow-lg
            bg-white
            "
          >
            <div className="relative h-52 w-full bg-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            </div>

            <div className="p-5 flex justify-center">
              <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}

      </div>

    </section>
  );
}