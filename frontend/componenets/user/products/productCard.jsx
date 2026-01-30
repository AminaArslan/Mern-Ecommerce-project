'use client';
import { useCart } from '@/context/cartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart, openCart } = useCart();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-lg overflow-hidden group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-90 w-full overflow-hidden">
 <Image
  src={hovered && product.images[1] ? product.images[1].url : product.images[0].url}
  alt={product.name || 'Product Image'}
  fill
  sizes="(max-width: 768px) 100vw, 300px" // important!
  style={{ objectFit: 'cover' }}
  className="transition-transform duration-500 group-hover:scale-105"
  placeholder="blur"
  blurDataURL="/placeholder.png"
/>


          {/* Hover White Overlay */}
          <div className={`absolute inset-0 bg-white bg-opacity-40 transition-opacity duration-300 ${hovered ? 'opacity-40' : 'opacity-0'}`}></div>

          {/* Add to Cart Button */}
          <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.preventDefault(); // prevent Link click
                addToCart(product);
                openCart();
              }}
              className="bg-white text-dark px-4 py-1 rounded font-semibold hover:bg-gray-200 transition cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>

      {/* Name & Price */}
      <div className="mt-2 px-2 pb-2 flex flex-col gap-1">
        <h3 className="text-dark font-semibold text-base">{product.name}</h3>
        <p className="text-dark ">Rs. {Number(product.price).toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
}
