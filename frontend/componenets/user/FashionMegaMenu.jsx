"use client";
import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";

const collections = [
  {
    number: "01",
    title: "Make it Forever",
    desc: "Timeless and radiant pieces crafted to celebrate your most precious moments.",
    img: "/topcollection/Collect01.webp",
  },
  {
    number: "02",
    title: "Better Basics Collection",
    desc: "Refined everyday essentials designed with modern elegance and comfort.",
    img: "/topcollection/collect02.webp",
  },
  {
    number: "03",
    title: "Curated Products",
    desc: "Handpicked statement styles that elevate your wardrobe instantly.",
    img: "/topcollection/collect03.webp",
  },
];

export default function CollectionsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="w-full bg-[var(--color-secondary)] py-20 px-4 ">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col gap-8 justify-center">
              <p className="font-medium text-base text-gray-700 relative group inline-block cursor-pointer uppercase">top collections</p>


        <h1 className="font-medium lg:text-4xl md:text-3xl sm:text-2xl text-xl text-dark">
  Define your style, <br />
  <span className="italic font-light">express your confidence</span>
</h1>
        {/* RIGHT IMAGE */}
        <div className="relative h-[420px] md:h-[520px]  overflow-hidden border border-[var(--color-deep)]/20 shadow-lg md:hidden">
          <Image
            src={collections[active].img}
            alt="collection preview"
            fill
            className="object-cover transition-all duration-500"
          />
        </div>
          <div className="space-y-10 ">
            {collections.map((item, i) => (
              <div
                key={i}
                onMouseEnter={() => setActive(i)}
                className="group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-5">
                    <span className="text-[var(--color-deep)] text-sm mt-1">
                      {item.number}.
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-[var(--color-dark)] group-hover:text-[var(--color-accent)] transition">
                        {item.title}
                      </h3>
                      {i === active && (
                        <p className="text-sm text-[var(--color-dark)]/80 mt-2 max-w-md transition-opacity duration-300">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>

                  <FiArrowUpRight className="text-[var(--color-deep)] group-hover:text-[var(--color-accent)] transition mt-1" />
                </div>

                <div className="h-px bg-[var(--color-deep)]/30 mt-6"></div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative h-[420px] md:h-[520px]  overflow-hidden border border-[var(--color-deep)]/20 shadow-lg hidden md:block">
          <Image
            src={collections[active].img}
            alt="collection preview"
            fill
            className="object-cover transition-all duration-500"
          />
        </div>
      </div>
    </section>
  );
}
