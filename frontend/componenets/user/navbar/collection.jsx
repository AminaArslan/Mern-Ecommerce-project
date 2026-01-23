'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';

export default function CollectionMenu() {
  const [open, setOpen] = useState(false);

  const collections = [
    {
      name: 'Men',
      slug: 'men',
      image: '/collection/menSs.jpg',
    },
    {
      name: 'Women',
      slug: 'women',
      image: '/collection/womes.jpg',
    },
    {
      name: 'Kids',
      slug: 'kids',
      image: '/collection/kids.jpg',
    },
  ];

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 hover:text-accent transition cursor-pointer"
      >
        Collection
        <FiChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`border-dark border-2 absolute top-full mt-7 -translate-x-[33%]  xl:-translate-x-[37.5%] 
           w-[90vw] max-w-7xl bg-primary/95 backdrop-blur-md
           rounded-xl shadow-2xl p-6 grid grid-cols-3 gap-6 transition-all duration-300 z-50 ${
             open ? 'opacity-100 visible' : 'opacity-0 invisible'
           }`}
      >
        {collections.map((col) => (
          <Link
            key={col.name}
            href={`/category/${col.slug}`} // updated to use slug dynamically
             onClick={() => setOpen(false)} // ✅ close menu on click
            className="relative group block h-64 rounded-xl overflow-hidden shadow-lg"
          >
            {/* Background Image */}
            <img
              src={col.image}
              alt={col.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Top-left: Category Name */}
            <span className="absolute top-3 left-3 text-lg font-bold text-light uppercase tracking-wide z-10">
              {col.name}
            </span>

            {/* Bottom-left: Shop Now */}
            <span className="absolute bottom-3 left-3 flex items-center gap-2 text-sm font-semibold text-light z-10 group-hover:underline">
              Shop Now <FiArrowRight />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
