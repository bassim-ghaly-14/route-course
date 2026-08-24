import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-primary-600 mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>

        <p className="text-gray-500 mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg transition"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="border border-gray-300 hover:bg-gray-100 px-5 py-2 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
}