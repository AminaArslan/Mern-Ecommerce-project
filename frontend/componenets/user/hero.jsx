'use client';

import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller } from 'swiper/modules'; // ✅ removed Pagination
import 'swiper/css';
import 'swiper/css/navigation';

import Image from 'next/image';
import Link from 'next/link';

export default function HeroPage() {
  const [imageSwiper, setImageSwiper] = useState(null);
  const [contentSwiper, setContentSwiper] = useState(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const slides = [
    {
      src: '/hero/bg.jpg',
      tag: 'ENCHANTING FASHION',
      title: 'Create Memories',
      highlight: 'With Style',
      description:
        'We believe in the power of clothing to express your personality, celebrate special moments, and make every day extraordinary.',
      button: 'SHOP NOW',
      bg: '#EAF2EF',
    },
    {
      src: '/hero/kid.jpg',
      tag: 'TIMELESS BEAUTY',
      title: 'Evening',
      highlight: 'Glamour',
      description:
        'Elegant gowns and dresses designed for nights that matter. Sophisticated fashion that reflects confidence and style.',
      button: 'EXPLORE',
      bg: '#F3ECE7',
    },
    {
      src: '/hero/men.jpg',
      tag: 'EVERYDAY STYLE',
      title: 'Casual',
      highlight: 'Essentials',
      description:
        'Effortless outfits for daily comfort. Trendy pieces that move with you, everywhere you go.',
      button: 'DISCOVER',
      bg: '#EEF1F7',
    },
  ];

  /* 🔗 Sync both swipers */
  useEffect(() => {
    if (imageSwiper && contentSwiper) {
      imageSwiper.controller.control = contentSwiper;
      contentSwiper.controller.control = imageSwiper;
    }
  }, [imageSwiper, contentSwiper]);

  /* 🎯 Attach custom navigation */
  useEffect(() => {
    if (contentSwiper && prevRef.current && nextRef.current) {
      prevRef.current.onclick = () => contentSwiper.slidePrev();
      nextRef.current.onclick = () => contentSwiper.slideNext();
    }
  }, [contentSwiper]);

  return (
    <main>
      {/* ================= HERO SECTION ================= */}
      <section className="">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-145 lg:h-[85vh]">

            {/* LEFT CONTENT */}
            <div className="relative flex items-center w-full h-[60vh] sm:h-[70vh] lg:h-full md:h-[80vh] order-2 md:order-1">
              <Swiper
                modules={[Controller]}
                onSwiper={setContentSwiper}
                loop
                className="w-full h-full px-6 md:px-10 pb-16"
              >
                {slides.map((slide, i) => (
                  <SwiperSlide
                    key={i}
                    className="flex items-center justify-center w-full h-full"
                    style={{ backgroundColor: slide.bg }}
                  >
                    <div className="flex flex-col mt-10 sm:mt-0 sm:justify-center items-center space-y-4 h-full px-2 sm:px-8">
                      <span className="text-sm md:text-base text-accent uppercase tracking-wide mb-6 sm:mb-8">
                        {slide.tag}
                      </span>

                      <h1 className="contents text-2xl sm:text-3xl md:text-4xl italic font-semibold text-dark text-center">
                        {slide.title} <span className="text-accent">{slide.highlight}</span>
                      </h1>

                      <p className="sm:text-lg  text-base md:text-base text-dark/80 text-center mt-6 sm:mt-8">
                        {slide.description}
                      </p>

                      <Link
                        href="/products"
                        className="bg-accent text-light  p-4 w-fit px-6 py-2 sm:mt-2 mb-4 sm:mb-0 text-base"
                      >
                        {slide.button}
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* CUSTOM NAVIGATION */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
                <button ref={prevRef} className="nav-btn">‹</button>
                <button ref={nextRef} className="nav-btn">›</button>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative overflow-hidden order-1 md:order-2 w-full md:w-auto h-[50vh] sm:h-[90vh] lg:h-full md:h-[80vh]">
              <Swiper
                modules={[Controller]}
                onSwiper={setImageSwiper}
                loop
                className="w-full h-full"
              >
                {slides.map((slide, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-full ">
                      <Image
                        src={slide.src}
                        alt={slide.title}
                        fill
                        priority={i === 0}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/2 0" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

          </div>

        </div>
      </section>
      {/* ================================================= */}
    </main>
  );
}
