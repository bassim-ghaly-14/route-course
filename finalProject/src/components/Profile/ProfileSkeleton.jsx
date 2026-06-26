export default function ProfileSkeleton() {
  return (
    <section className="min-h-screen bg-slate-50 overflow-hidden animate-pulse">

      {/* Hero */}
      <div className="relative bg-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            <div>
              <div className="h-8 w-32 rounded-full bg-gray-200 mb-5"></div>

              <div className="h-14 w-72 bg-gray-200 rounded-xl mb-4"></div>

              <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
            </div>

            <div className="w-28 h-28 rounded-full bg-gray-200"></div>

          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 -mt-12 relative z-20">

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-3xl p-7 shadow-lg"
            >
              <div className="flex items-center justify-between">

                <div>
                  <div className="h-5 w-28 bg-gray-200 rounded mb-4"></div>

                  <div className="h-12 w-20 bg-gray-200 rounded"></div>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-gray-200"></div>

              </div>
            </div>
          ))}

        </div>

        {/* Latest Orders */}
        <div className="mt-10 bg-white rounded-[32px] shadow-xl overflow-hidden">

          <div className="bg-gray-300 px-8 py-6">
            <div className="h-8 w-48 bg-gray-200 rounded mb-3"></div>

            <div className="h-5 w-64 bg-gray-200 rounded"></div>
          </div>

          <div className="p-8 space-y-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="border border-gray-100 rounded-3xl p-5"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-gray-200"></div>

                    <div>
                      <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>

                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="h-8 w-24 bg-gray-200 rounded-full"></div>

                    <div>
                      <div className="h-4 w-14 bg-gray-200 rounded mb-2"></div>

                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}