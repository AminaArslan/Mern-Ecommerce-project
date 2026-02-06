"use client";
import { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import Link from 'next/link';

export default function ProductCompare() {
  const [dividerPos, setDividerPos] = useState(50);
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  // Handle interaction (Mouse & Touch)
  const handleMove = (clientX) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let pos = ((clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, pos));
    setDividerPos(pos);
  };

  const onMouseMove = (e) => {
    if (!isResizing) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e) => {
    if (!isResizing) return;
    handleMove(e.touches[0].clientX);
  };

  const stopInteraction = () => setIsResizing(false);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("mouseup", stopInteraction);
      window.addEventListener("touchend", stopInteraction);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", stopInteraction);
      window.removeEventListener("touchend", stopInteraction);
    };
  }, [isResizing]);

  return (
    <section className="w-full py-20 lg:py-32 bg-white border-t border-gray-100">
      <div className="container mx-auto px-3 md:px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* INTERACTIVE COMPARISON SLIDER */}
        <div
          ref={containerRef}
          className="relative w-full aspect-4/3 rounded-sm overflow-hidden cursor-ew-resize select-none group shadow-xl"
          onMouseDown={(e) => { setIsResizing(true); handleMove(e.clientX); }}
          onTouchStart={(e) => { setIsResizing(true); handleMove(e.touches[0].clientX); }}
        >
          {/* Left Image (Base) */}
          <img
            src="/compare/4tiles_web_print.webp"
            alt="Style Variant 1"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 z-20">
            <span className="text-white text-xs font-bold tracking-[0.2em] uppercase bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
              Style 01
            </span>
          </div>

          {/* Right Image (Overlay) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${dividerPos}%)` }}
          >
            <img
              src="/compare/carousel_desktop_WEST.webp"
              alt="Style Variant 2"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6 z-20">
              <span className="text-white text-xs font-bold tracking-[0.2em] uppercase bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                Style 02
              </span>
            </div>
          </div>

          {/* Draggable Divider */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-30 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            style={{ left: `${dividerPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl scale-100 transition-transform duration-200 hover:scale-110 active:scale-95">
              <FiChevronLeft className="text-dark w-4 h-4" />
              <FiChevronRight className="text-dark w-4 h-4" />
            </div>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="flex flex-col space-y-8">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-4 block">
              Versatility
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-dark leading-tight">
              One Design, <br /> Two Expressions.
            </h2>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed font-light max-w-lg">
            Discover how a single silhouette transforms with texture and tone.
            From the structured elegance of our West collection to the fluid drapes of East,
            find the balance that speaks to your personal style.
          </p>

          <Link href="/category" className="group inline-flex items-center gap-3 text-dark font-medium tracking-wide border-b border-dark pb-1 w-fit hover:text-gray-600 hover:border-gray-600 transition-all">
            Explore The Series
            <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}