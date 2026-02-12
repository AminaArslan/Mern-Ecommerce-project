
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
      href: '/category',

    },
    {
      src: '/hero/kid.jpg',
      tag: 'SPRING 2026',
      title: 'Playful Spirits',
      description: 'Comfortable & stylish outfits for every little adventure.',
      button: 'EXPLORE KIDS',
      href: '/category',

    },
    {
      src: '/hero/men.jpg',
      tag: 'URBAN ESSENTIALS',
      title: 'Modern Gentleman',
      description: 'Refined cuts and premium fabrics for the daily grind.',
      button: 'SHOP MEN',
      href: '/category',

    },
  ];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect={'fade'}
        fadeEffect={{
          crossFade: true
        }}
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
          <SwiperSlide key={i} className="relative w-full h-full overflow-hidden">

            {/* 🎥 KEN BURNS EFFECT IMAGE */}
            <div className="absolute inset-0 w-full h-full slide-image-container">
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={i === 0}
                className="object-cover opacity-80 transition-opacity duration-1000"
              />
              {/* Dark Overlay for Text Readability */}
              {/* <div className="absolute inset-0 bg-black/40" /> */}
            </div>

            {/* ✨ CONTENT OVERLAY */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div className="max-w-4xl flex flex-col items-center gap-6 slide-content">

                {/* Tagline */}
                <p className="text-white/90 text-sm md:text-base tracking-[0.4em] uppercase font-medium slide-tag">
                  {slide.tag}
                </p>

                {/* Main Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-none drop-shadow-2xl slide-title">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="text-gray-100 text-base md:text-xl font-light max-w-xl tracking-wide slide-description">
                  {slide.description}
                </p>

                {/* Action Button */}
                {/* Action Button wrapped in div to break adjacency */}
                <div className="slide-button">
                  {/* eslint-disable-next-line @next/next/no-duplicate-links */}
                  <Link
                    href={slide.href}
                    className="mt-6 group relative px-8 py-3 bg-white text-black rounded-sm transition-all duration-300 hover:bg-white/90 hover:scale-105 inline-block"
                  >
                    <span className="font-bold tracking-[0.1em] text-xs md:text-sm flex items-center gap-2">
                      {slide.button}
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>

              </div>
            </div>

          </SwiperSlide>
        ))}

        {/* CUSTOM PAGINATION STYLING */}
        <div className="swiper-pagination bottom-10!" />
      </Swiper>

      {/* CSS for Professional Animations triggered by Swiper Active state */}
      <style jsx global>{`
        /* 🎥 Ken Burns effect only on active slide */
        .swiper-slide-active .slide-image-container {
          animation: ken-burns 10s ease-out forwards;
        }
        
        @keyframes ken-burns {
          0% { transform: scale(1.1) translate(0, 0); }
          100% { transform: scale(1); translate(0, 0); }
        }

        /* ✨ Content Animations scoped to active slide */
        .slide-content > * {
          opacity: 0;
        }

        .swiper-slide-active .slide-tag {
          animation: fade-in-down 0.8s ease-out 0.4s forwards;
        }
        .swiper-slide-active .slide-title {
          animation: fade-in-up 0.8s ease-out 0.6s forwards;
        }
        .swiper-slide-active .slide-description {
          animation: fade-in-up 0.8s ease-out 0.8s forwards;
        }
        .swiper-slide-active .slide-button {
          animation: fade-in-up 0.8s ease-out 1s forwards;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* 🏁 Pagination Styling */
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0 6px !important;
        }
        .swiper-pagination-bullet-active {
          width: 40px;
          background: #fff;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
