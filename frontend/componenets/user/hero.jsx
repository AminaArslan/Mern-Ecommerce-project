'use client';

import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function HeroPage() {
  const slides = [
    {
      src: '/hero/hero.webp',
      tag: 'NEW ARRIVALS',
      title: 'Timeless Elegance',
      description: 'Discover the new collection that defines modern luxury.',
      button: 'SHOP COLLECTION',
    },
    {
      src: '/hero/kid.jpg',
      tag: 'SPRING 2026',
      title: 'Playful Spirits',
      description: 'Comfortable & stylish outfits for every little adventure.',
      button: 'EXPLORE KIDS',
    },
    {
      src: '/hero/men.jpg',
      tag: 'URBAN ESSENTIALS',
      title: 'Modern Gentleman',
      description: 'Refined cuts and premium fabrics for the daily grind.',
      button: 'SHOP MEN',
    },
  ];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect={'fade'}
        speed={1500}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + ' hover:bg-white"></span>';
          },
        }}
        className="w-full h-full group"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="relative w-full h-full">

            {/* 🎥 KEN BURNS EFFECT IMAGE */}
            <div className="absolute inset-0 w-full h-full animate-ken-burns">
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={i === 0}
                className="object-cover opacity-90"
              />
              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* ✨ CONTENT OVERLAY */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div className="max-w-4xl opacity-0 animate-fade-up flex flex-col items-center gap-6">

                {/* Tagline */}
                <p className="text-white/90 text-sm md:text-base tracking-[0.3em] uppercase font-medium animate-slide-down">
                  {slide.tag}
                </p>

                {/* Main Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-wide leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="text-gray-200 text-lg md:text-xl font-light max-w-2xl tracking-wide">
                  {slide.description}
                </p>

                {/* Action Button */}
                <Link
                  href="/category"
                  className="mt-4 group relative px-8 py-3 overflow-hidden rounded-full border border-white text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                >
                  <span className="relative z-10 font-medium tracking-widest text-sm flex items-center gap-2">
                    {slide.button} <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

              </div>
            </div>

          </SwiperSlide>
        ))}

        {/* CUSTOM PAGINATION STYLING */}
        <div className="swiper-pagination !bottom-10" />
      </Swiper>

      {/* CSS for Ken Burns Animation if not in globals */}
      <style jsx global>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s ease-out infinite alternate;
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 1.2s ease-out forwards;
          animation-delay: 0.5s;
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 1s ease-out forwards;
          animation-delay: 0.3s;
        }
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          width: 24px;
          background: #fff;
          border-radius: 99px;
        }
      `}</style>
    </section>
  );
}
