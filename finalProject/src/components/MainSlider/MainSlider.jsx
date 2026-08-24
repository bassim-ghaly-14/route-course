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
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[70vh] w-full">

              {/* Image — first (visible) slide loads eagerly with high
                  priority; off-screen slides lazy-load so they never block
                  initial rendering. */}
              <img
                src={slide.image}
                alt={slide.title}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                {...(index === 0 ? {} : { decoding: "async" })}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center bg-black/60">
                <div className="mx-auto w-full px-6 text-white sm:px-10">

                  <div className="glass max-w-xl rounded-2xl border-white/20 bg-black/35 p-6 shadow-lg sm:p-8">

                    <h2 className="mb-3 text-3xl font-extrabold tracking-tight md:text-5xl">
                      {slide.title}
                    </h2>

                    <p className="mb-6 text-base text-gray-200 md:text-xl">
                      {slide.subtitle}
                    </p>

                    <Link
                      to={slide.link}
                      className="inline-flex min-h-11 items-center rounded-xl bg-primary-600 px-6 py-2.5 font-semibold shadow-sm transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300"
                    >
                      {slide.btn}
                    </Link>

                  </div>

                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}