'use client';
import { useCart } from '@/context/cartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiShoppingBag } from 'react-icons/fi';


export default function ProductCard({ product }) {
  const { addToCart, openCart } = useCart();
  const [hovered, setHovered] = useState(false);

  const stock = Number(product.quantity) || 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (isOutOfStock) {
      toast.error('This item is out of stock', {
        style: {
          background: '#dc2626',
          color: '#fff',
          borderRadius: '0px'
        }
      });
      return;
    }

    // Check if item already in cart and would exceed stock
    const result = addToCart(product);

    // If addToCart returns success: false, it means stock limit was reached
    if (result.success === false) {
      toast.error(`Only ${result.limit} available in stock`, {
        style: {
          background: '#f59e0b',
          color: '#fff',
          borderRadius: '0px'
        }
      });
      return;
    }

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div
      className={`group cursor-pointer flex flex-col gap-3 ${isOutOfStock ? 'opacity-60' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">

        {/* Main Image */}
        <Image
          src={product.images[0]?.url || 'https://placehold.co/600x800/f3f4f6/374151?text=STUDIO+AMINA'}
          alt={product.name || 'Product'}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className={`object-cover transition-opacity duration-700 ease-in-out ${hovered && product.images[1] ? 'opacity-0' : 'opacity-100'} ${isOutOfStock ? 'grayscale' : ''}`}
        />

        {/* Second Image (Hover) */}
        {product.images[1] && (
          <Image
            src={product.images[1].url}
            alt={product.name || 'Product Hover'}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className={`object-cover transition-all duration-700 ease-in-out scale-105 group-hover:scale-100 absolute inset-0 ${hovered ? 'opacity-100' : 'opacity-0'} ${isOutOfStock ? 'grayscale' : ''}`}
          />
        )}

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] uppercase font-bold px-3 py-1.5 tracking-widest shadow-lg">
            Out of Stock
          </div>
        ) : isLowStock ? (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] uppercase font-bold px-3 py-1.5 tracking-widest shadow-lg">
            Only {stock} Left
          </div>
        ) : null}

        {/* Floating Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`absolute bottom-4 right-4 bg-white text-dark p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-dark hover:text-white z-10 ${isOutOfStock ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer'
            }`}
          title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        >
          <FiShoppingBag size={18} />
        </button>

      </Link>

      {/* Info */}
      <div className="flex flex-col items-start space-y-1">
        <Link href={`/products/${product.slug}`} className="text-sm font-medium text-dark uppercase tracking-wide hover:text-gray-500 transition-colors line-clamp-1">
          {product.name}
        </Link>
        <p className="text-sm text-gray-700 font-semibold">
          Rs. {Number(product.price).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}
