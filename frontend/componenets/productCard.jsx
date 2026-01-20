'use client';
import { useCart } from '@/context/cartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // Safe first image URL
  const imageUrl = product.image?.url || '/placeholder.png';

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden flex flex-col transition duration-300">
      <Link href={`/products/${product.slug}`} className="group">
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name || 'Product Image'}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-105 transition-transform duration-300"
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-accent">{product.name}</h3>
          <p className="text-blue-500 font-bold">${product.price}</p>
        </div>
      </Link>

      <button
        onClick={() => addToCart(product)}
        className="mt-auto bg-accent text-white py-2 px-4 m-4 rounded hover:bg-dark transition duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
}
