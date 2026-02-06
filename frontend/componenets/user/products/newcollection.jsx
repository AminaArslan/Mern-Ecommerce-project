"use client";
import { useEffect, useState, useRef } from "react";
import { getNewSubcategoriesByParent } from "@/lib/axios";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function ExploreNewCollection() {
  const [groups, setGroups] = useState([]);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    getNewSubcategoriesByParent()
      .then(setGroups)
      .catch(console.error);
  }, []);

  const productBoxes = groups
    .flatMap((group) =>
      group.subcategories.map((sub) => ({ ...sub, parentName: group.parentName }))
    )
    .slice(0, 10);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="w-full py-10 lg:pb-15 bg-white overflow-hidden">
      <div className="container mx-auto px-3 md:px-6 max-w-7xl">

        {/* Header - Editorial Style */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2 block">
              Season 2026
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-dark leading-tight">
              Curated Collections
            </h2>
          </div>
          <div className="hidden md:block text-sm text-gray-500 font-medium tracking-wide">
            Swipe to explore →
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-12 cursor-grab active:cursor-grabbing -mx-3 md:-mx-6 px-3 md:px-6"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {productBoxes.map((sub) => (
            <Link
              key={sub._id}
              href={`/category/${sub.slug}`}
              className="group relative shrink-0 w-[280px] md:w-[320px] aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 select-none"
            >
              {/* Image */}
              <img
                src={sub.products?.[0]?.images?.[0]?.url || "/placeholder.jpg"}
                alt={sub.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                draggable="false"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="text-xs text-white/70 uppercase tracking-widest mb-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {sub.parentName || "Collection"}
                </span>

                <h3 className="text-2xl text-white font-serif tracking-wide mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {sub.name}
                </h3>

                <div className="w-12 h-[1px] bg-white mt-4 opacity-50 group-hover:w-full transition-all duration-700 ease-out" />

                <div className="flex items-center gap-2 mt-4 text-white text-sm font-medium tracking-wider opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  View Collection <FiArrowRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}