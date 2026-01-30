"use client";
import { useEffect, useState, useRef } from "react";
import { getNewSubcategoriesByParent } from "@/lib/axios";
import Link from "next/link";

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
    const walk = (x - startX) * 2; // adjust scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="w-full pb-12 lg:pb-26">
      <div className="  lg:container lg:mx-auto px-4">
        <div className="mb-8 sm:mb-14 flex flex-col justify-center items-center">
          <h2 className="font-heading text-2xl sm:text-3xl text-center">
            Explore our <span className="">𝒏𝒆𝒘 𝒄𝒐𝒍𝒍𝒆𝒄𝒕𝒊𝒐𝒏</span>
          </h2>
        </div>

        {/* Horizontal carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
         style={{
scrollPaddingLeft: "1rem",
scrollPaddingRight: "1rem",
scrollbarWidth: "none", // Firefox
msOverflowStyle: "none", // IE 10+
}}
        >
 {productBoxes.map((sub) => (
  <Link
    key={sub._id}
    href={`/category/${sub.slug}`}
    className="group shrink-0 w-60 md:w-80 lg:w-100 xl:w-120 mx-auto overflow-hidden shadow-lg relative"
  >
    {/* Image with zoom on hover */}
    <img
      src={sub.products?.[0]?.images?.[0]?.url || "/placeholder.jpg"}
      alt={sub.products?.[0]?.name || sub.name}
      className="w-full h-70 md:h-90 lg:h-110 xl:h-130 object-cover transition-transform duration-300 group-hover:scale-105"
    />

    {/* Overlay with text */}
<div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
  <h3 className="text-white text-2xl font-semibold relative inline-block">
    {sub.name}
    {/* Underline appears only on hover */}
    <span className="block h-0.5 bg-white mt-1 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
  </h3>
  <p className="text-white/80 mt-2 text-sm">
    {sub.parentName ? `For ${sub.parentName}` : "Category"}
  </p>
</div>
  </Link>
))}
        </div>
      </div>
    </section>
  );
}