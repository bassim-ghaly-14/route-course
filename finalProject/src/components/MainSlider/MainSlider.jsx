import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

export default function MainSlider() {
  const slides = [
    {
      id: 1,
      title: "Up to 50% OFF",
      subtitle: "On Fashion Collection 2026",
      btn: "Shop Fashion",
      image:
        "https://api.ellecanada.com/app/uploads/2026/03/green_spring_trend.png",
      link: "/products",
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Discover Latest Electronics Deals",
      btn: "Explore Electronics",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1920&q=80",
      link: "/products",
    },
    {
      id: 3,
      title: "Free Delivery",
      subtitle: "On Orders Over 500 EGP",
      btn: "Go to Cart Offers",
      image:
        "https://img.freepik.com/premium-photo/smartphone-hand-fast-delivery-man-green-scooter-delivery-concept-online-order-food-delivery-last-mile-banner-template_99433-7131.jpg",
      link: "/cart",
    },
  ];

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500 }}
        pagination={{ clickable: true }}
        loop={true}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[70vh] w-full">

              {/* Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-center">
                <div className="container mx-auto px-10 text-white">

                  <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h2>

                  <p className="text-lg md:text-2xl mb-6 text-gray-200">
                    {slide.subtitle}
                  </p>

                  <Link
                    to={slide.link}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition inline-block"
                  >
                    {slide.btn}
                  </Link>

                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}