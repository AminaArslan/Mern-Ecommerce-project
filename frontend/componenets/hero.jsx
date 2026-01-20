'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroCarousel() {
  const slides = [
    { src: '/bg01.jpg', alt: 'Summer Collection', title: 'Summer Collection', subtitle: 'Trendy & Stylish Dresses' },
    { src: '/bg02.jpg', alt: 'Evening Gowns', title: 'Evening Gowns', subtitle: 'Elegant & Classy' },
    { src: '/bg03.png', alt: 'Casual Wear', title: 'Casual Wear', subtitle: 'Comfortable & Chic' },
  ];

  return (
    <section className="w-full flex flex-col md:flex-row h-auto md:h-[90vh] gap-6 md:gap-0 md:mt-0 mt-3 ">
      {/* Left Side - Slider */}
      <div className="w-full md:w-3/4 h-[60vh] md:h-full relative group">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.custom-next',
            prevEl: '.custom-prev',
          }}
          loop={true}
          className="h-full rounded-lg overflow-hidden shadow-xl"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-start px-6 md:px-12 text-white">
                  <h1 className="text-2xl md:text-5xl font-bold mb-2 drop-shadow-lg">{slide.title}</h1>
                  <p className="text-lg md:text-2xl drop-shadow-md">{slide.subtitle}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation Buttons */}
          <div className="custom-prev absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-accent rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg opacity-70 hover:opacity-100 transition duration-300 hover:bg-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="custom-next absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-accent rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg opacity-70 hover:opacity-100 transition duration-300 hover:bg-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Custom Pagination */}
          <div className="absolute bottom-4 left-6 z-20 flex space-x-2">
            {/* Tailwind styled bullets can be added via global CSS */}
          </div>
        </Swiper>
      </div>

      {/* Right Side - Content */}
      <div className="w-full md:w-1/4 bg-primary flex flex-col justify-center items-start px-6 lg:px-8 py-8 space-y-4 lg:space-y-6 rounded-lg shadow-lg">
        <h2 className="text-2xl lg:text-3xl font-bold text-dark drop-shadow-md">
          Welcome to Our Store!
        </h2>
        <p className="text-base lg:text-lg text-dark">
          Explore our latest collection of stylish dresses. From casual to evening wear, find your perfect outfit here. 
        </p>
        <Link
          href="/products"
          className="btn-primary mt-2 w-full text-center"
        >
          Shop Now
        </Link>

        {/* Optional secondary content */}
        <div className="mt-4 space-y-1">
          <p className="text-sm text-dark/80">Free shipping on orders above $50</p>
          <p className="text-sm text-dark/80">30-day return policy</p>
        </div>
      </div>
    </section>
  );
}
