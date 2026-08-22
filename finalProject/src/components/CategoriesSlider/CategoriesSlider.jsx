import { axiosInstance } from "../../api/axiosInstance";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

import SliderSkeleton from "./SliderSkeleton";

export default function CategoriesSlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getCategories() {
      try {
        setError(null);
        const { data } = await axiosInstance.get("/categories");

        setCategories(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, []);

  // Only show the skeleton while the request is actually in flight.
  // Previously an empty/failed result kept the skeleton on screen forever.
  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return (
      <div className="my-10 text-center text-red-600">{error}</div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="my-10">
      <h2 className="text-green-600 text-2xl font-bold mb-6">
        Shop Popular Categories
      </h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat._id}>
            <Link to={`/category/${cat._id}`}>
              <div className="text-center group cursor-pointer">
                <div className="overflow-hidden rounded-full border-2 border-gray-200 group-hover:border-green-600 transition">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-28 object-cover"
                  />
                </div>

                <p className="mt-2 text-sm font-medium group-hover:text-green-600 transition">
                  {cat.name}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
