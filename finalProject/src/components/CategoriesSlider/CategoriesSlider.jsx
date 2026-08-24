import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

import useCategories from "../../hooks/useCategories";
import SliderSkeleton from "./SliderSkeleton";
import ErrorState from "../ui/ErrorState";

export default function CategoriesSlider() {
  const { data: categories = [], isLoading, isError, refetch } = useCategories();

  if (isLoading) {
    return <SliderSkeleton />;
  }

  if (isError) {
    return (
      <div className="my-10">
        <ErrorState
          message="Failed to load categories."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="my-10">
      <h2 className="section-header">
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
            <Link to={`/categories/${cat._id}`}>
              <div className="text-center group cursor-pointer">
                <div className="overflow-hidden rounded-full border-2 border-gray-200 group-hover:border-primary-600 transition">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-28 object-cover"
                  />
                </div>

                <p className="mt-2 text-sm font-medium group-hover:text-primary-600 transition">
                  {cat.name}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
