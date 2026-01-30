"use client";
import { useState, useRef } from "react";
import { FaSun, FaSnowflake } from "react-icons/fa";

export default function ProductCompare() {
  const [dividerPos, setDividerPos] = useState(50);
  const containerRef = useRef(null);

  // Mouse drag
  const startDrag = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (moveEvent) => {
      const rect = container.getBoundingClientRect();
      let pos = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      setDividerPos(pos);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Touch drag
  const startTouch = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchMove = (touchEvent) => {
      const rect = container.getBoundingClientRect();
      let pos =
        ((touchEvent.touches[0].clientX - rect.left) / rect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      setDividerPos(pos);
    };

    const onTouchEnd = () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
  };

  return (
    <section className=" flex pb-12 lg:pb-26">
      <div className="container mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image comparison */}
        <div
          ref={containerRef}
          className="relative w-full  h-60 sm:h-96 overflow-hidden shadow-lg "
        >
          {/* Left image */}
          <img
            src="/compare/4tiles_web_print.webp"
            alt="Summer"
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300"
            style={{
              filter: `brightness(${100 - dividerPos * 0.2}%)`,
              transform: `scale(${1 + dividerPos * 0.002})`,
            }}
          />
          {/* Summer Label */}
          <span
            className="absolute top-4 left-4 bg-white/70 px-2 py-1 rounded font-semibold text-sm transition-opacity duration-300 z-20"
            style={{ opacity: dividerPos > 5 ? 1 : 0 }}
          >
            West
          </span>

          {/* Right image */}
          <img
            src="/compare/carousel_desktop_WEST.webp"
            alt="Winter"
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300"
            style={{
              clipPath: `inset(0 ${100 - dividerPos}% 0 0)`,
              filter: `blur(${(100 - dividerPos) * 0.05}px)`,
              transform: `scale(${1 + (100 - dividerPos) * 0.002})`,
            }}
          />
          {/* Winter Label */}
          <span
            className="absolute top-4 right-4 bg-white/70 px-2 py-1 rounded font-semibold text-sm transition-opacity duration-300 z-20"
            style={{ opacity: dividerPos < 95 ? 1 : 0 }}
          >
            East
          </span>

          {/* Divider line */}
          <div
            className="absolute top-0 h-full w-1 bg-white z-10 pointer-events-none"
            style={{ left: `${dividerPos}%` }}
          ></div>

          {/* Handle circle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-300 shadow z-20
                       cursor-ew-resize flex items-center justify-center transition-transform duration-150
                       hover:scale-110 hover:bg-white/90 active:scale-125"
            style={{ left: `${dividerPos}%`, transform: `translate(-50%, -50%)` }}
            onMouseDown={startDrag}
            onTouchStart={startTouch}
          >
            {dividerPos < 50 ? (
              <FaSun className="text-yellow-500 w-5 h-5" />
            ) : (
              <FaSnowflake className="text-blue-400 w-5 h-5" />
            )}
          </div>
        </div>

        {/* Product info */}
<div className="flex flex-col  gap-4 lg:gap-8">
    <p className="font-medium text-base text-gray-600 relative group inline-block cursor-pointer uppercase">compare</p>
    <h1 className="font-medium lg:text-4xl md:text-3xl sm:text-2xl text-xl text-dark">
      Signature All-Season Series
    </h1>
    <p className="text-gray-700 text-base">
      Inspired by timeless elegance and effortless comfort, this collection is crafted for modern living. Each piece is thoughtfully designed to transition from busy city mornings to serene weekend escapes. Ethically made with attention to detail, it celebrates both style and sustainability.
    </p>
  


<span className="text-gray-800 font-medium underline underline-offset-4 cursor-pointer">
  DISCOVER MORE
</span>
</div>
      </div>
    </section>
  );
}