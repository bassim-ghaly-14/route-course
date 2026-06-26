import axios from "axios";
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

  useEffect(() => {
    async function getCategories() {
      try {
        const { data } = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/categories"
        );

        setCategories(data.data || []);
      } catch (err) {
        console.log(err);
        setCategories([]); 
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, []);

  if (loading || categories.length === 0) {
    return <SliderSkeleton />;
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