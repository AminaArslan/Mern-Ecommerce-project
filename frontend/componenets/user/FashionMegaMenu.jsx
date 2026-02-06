"use client";
import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    number: "01",
    title: "Make it Forever",
    desc: "Timeless and radiant pieces crafted to celebrate your most precious moments.",
    img: "/topcollection/Collect01.webp",
    link: "/category/women"
  },
  {
    number: "02",
    title: "Better Basics",
    desc: "Refined everyday essentials designed with modern elegance and comfort.",
    img: "/topcollection/collect02.webp",
    link: "/category/men"
  },
  {
    number: "03",
    title: "Curated Statement",
    desc: "Handpicked statement styles that elevate your wardrobe instantly.",
    img: "/topcollection/collect03.webp",
    link: "/category/new-arrivals"
  },
];

export default function CollectionsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="w-full bg-(--color-secondary) lg:min-h-screen flex items-center py-12 lg:py-24 px-3 sm:px-4 md:px-6">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-center h-full">

        {/* LEFT CONTENT: Interactive List */}
        <div className="flex flex-col justify-center order-2 lg:order-1 py-4 lg:py-0">
          <div className="mb-6 lg:mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2 lg:mb-3 block">
              Editor's Choice
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-dark leading-tight">
              Define your style, <br />
              <span className="italic font-light text-gray-500">express your confidence.</span>
            </h2>
          </div>

          <div className="space-y-3 lg:space-y-8">
            {collections.map((item, i) => (
              <Link href={item.link} key={i}>
                <div
                  onMouseEnter={() => setActive(i)}
                  className={`group cursor-pointer border-t pt-3 lg:pt-8 transition-all duration-500 ${i === active ? "border-dark" : "border-gray-200"
                    }`}
                >
                  <div className="flex items-baseline justify-between">
                    <div className="flex gap-4 md:gap-10">
                      <span className={`text-xs lg:text-sm font-mono transition-colors duration-300 ${i === active ? "text-dark" : "text-gray-300"
                        }`}>
                        {item.number}
                      </span>
                      <div>
                        <h3 className={`text-lg sm:text-2xl md:text-3xl font-serif transition-colors duration-300 ${i === active ? "text-dark" : "text-gray-300 group-hover:text-gray-500"
                          }`}>
                          {item.title}
                        </h3>

                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${i === active ? "max-h-24 opacity-100 mt-2 lg:mt-4" : "max-h-0 opacity-0"
                          }`}>
                          <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-md hidden sm:block">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <FiArrowUpRight className={`text-lg lg:text-xl transition-all duration-300 transform ${i === active ? "text-dark translate-x-0 translate-y-0" : "text-gray-200 translate-x-2 translate-y-2 opacity-0"
                      }`} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE: Dynamic Display */}
        <div className="relative h-64 sm:h-100 lg:h-187.5 w-full order-1 lg:order-2 rounded-lg overflow-hidden shrink-0">
          {/* Desktop/Tablet Image (Fade Effect) */}
          <div className="hidden lg:block w-full h-full">
            {collections.map((item, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${active === i ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover grayscale-20"
                  priority={i === 0}
                />
                <div className="absolute inset-0 ring-1 ring-black/5 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Mobile Image (Static/Active Only) */}
          <div className="lg:hidden block w-full h-full relative">
            <Image
              src={collections[active].img}
              alt={collections[active].title}
              fill
              className="object-cover grayscale-20 object-top"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
