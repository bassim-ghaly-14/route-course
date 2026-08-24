export default function CartSkeleton() {
  return (
    <section className="py-8">
      <h2 className="text-2xl text-primary-600 py-10 font-bold">
        Shop Now
      </h2>

      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-primary-100">
        <table className="w-full animate-pulse">
          <thead className="bg-primary-50 border-b border-primary-100">
            <tr>
              <th className="px-16 py-4"></th>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 4 }).map((_, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td className="p-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-200"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-10 w-28 bg-gray-200 rounded-full"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-5 space-y-4">
          <div className="h-12 rounded-xl bg-gray-200 animate-pulse"></div>

          <div className="h-8 w-64 mx-auto rounded bg-gray-200"></div>

          <div className="h-12 rounded-xl bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}