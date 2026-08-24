import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    eyebrow: "TRENDING NOW",
    title: "Up to 50% OFF",
    subtitle: "Refresh your wardrobe with our latest fashion collection.",
    button: "Shop Fashion",
    image:
      "https://api.ellecanada.com/app/uploads/2026/03/green_spring_trend.png",
    link: "/products",
  },
  {
    id: 2,
    eyebrow: "JUST DROPPED",
    title: "New Arrivals",
    subtitle: "Discover the latest electronics and upgrade your everyday essentials.",
    button: "Explore Electronics",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1920&q=80",
    link: "/products",
  },
  {
    id: 3,
    eyebrow: "DELIVERY DEAL",
    title: "Free Delivery",
    subtitle: "Enjoy free delivery when your order reaches 500 EGP.",
    button: "Start Shopping",
    image:
      "https://img.freepik.com/premium-photo/smartphone-hand-fast-delivery-man-green-scooter-delivery-concept-online-order-food-delivery-last-mile-banner-template_99433-7131.jpg",
    link: "/products",
  },
];

export default function MainSlider() {
  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="TRADO featured offers"
    >
      <Swiper
        modules={[Autoplay, Pagination, A11y]}
        loop
        speed={700}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        a11y={{
          enabled: true,
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          paginationBulletMessage: "Go to slide {{index}}",
        }}
        className="trado-main-slider"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <article className="relative h-[520px] w-full sm:h-[560px] lg:h-[620px]">
              {/* =====================================================
                  BACKGROUND IMAGE
              ===================================================== */}

              <img
                src={slide.image}
                alt=""
                aria-hidden="true"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* =====================================================
                  IMAGE OVERLAY
              ===================================================== */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-black/75
                  via-black/45
                  to-black/10
                  sm:from-black/70
                  sm:via-black/35
                  sm:to-transparent
                "
                aria-hidden="true"
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/35
                  via-transparent
                  to-transparent
                "
                aria-hidden="true"
              />

              {/* =====================================================
                  CONTENT
              ===================================================== */}

              <div
                className="
                  page-container
                  relative
                  flex
                  h-full
                  items-center
                "
              >
                <div className="max-w-2xl pb-10 text-white sm:pb-12 lg:pb-16">
                  {/* Eyebrow */}

                  <div
                    className="
                      mb-4
                      inline-flex
                      items-center
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
                      px-3.5
                      py-1.5
                      text-xs
                      font-bold
                      tracking-[0.16em]
                      text-white
                      backdrop-blur-md
                      sm:mb-5
                    "
                  >
                    {slide.eyebrow}
                  </div>

                  {/* Title */}

                  <h2
                    className="
                      max-w-xl
                      text-4xl
                      font-extrabold
                      leading-[1.05]
                      tracking-tight
                      text-white
                      sm:text-5xl
                      md:text-6xl
                      lg:text-7xl
                    "
                  >
                    {slide.title}
                  </h2>

                  {/* Subtitle */}

                  <p
                    className="
                      mt-4
                      max-w-lg
                      text-sm
                      font-medium
                      leading-6
                      text-white/80
                      sm:mt-5
                      sm:text-base
                      sm:leading-7
                      md:text-lg
                    "
                  >
                    {slide.subtitle}
                  </p>

                  {/* CTA */}

                  <div className="mt-7 sm:mt-8">
                    <Link
                      to={slide.link}
                      className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-primary-600
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-white
                        shadow-lg
                        shadow-black/10
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-primary-700
                        hover:shadow-xl
                        focus-visible:outline-none
                        focus-visible:ring-4
                        focus-visible:ring-primary-300
                        active:translate-y-0
                        sm:px-6
                      "
                    >
                      <span>{slide.button}</span>

                      <span
                        aria-hidden="true"
                        className="
                          text-base
                          transition-transform
                          duration-200
                          group-hover:translate-x-0.5
                        "
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* =========================================================
          SLIDER STYLES
      ========================================================= */}

      <style>{`
        .trado-main-slider .swiper-pagination {
          bottom: 22px;
          left: auto;
          right: 24px;
          width: auto;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .trado-main-slider .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          margin: 0 !important;
          opacity: 0.55;
          border-radius: 999px;
          background: white;
          transition:
            width 200ms ease,
            opacity 200ms ease;
        }

        .trado-main-slider .swiper-pagination-bullet-active {
          width: 24px;
          opacity: 1;
        }

        @media (max-width: 640px) {
          .trado-main-slider .swiper-pagination {
            bottom: 18px;
            right: 16px;
          }

          .trado-main-slider .swiper-pagination-bullet {
            width: 6px;
            height: 6px;
          }

          .trado-main-slider .swiper-pagination-bullet-active {
            width: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trado-main-slider .swiper-pagination-bullet {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
