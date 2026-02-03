'use client';
import { useEffect, useState } from 'react';
import { getTopProductsStats } from '@/lib/axios';
import Image from 'next/image';

export default function TopProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const data = await getTopProductsStats();
        setProducts(data.slice(0, 5)); // show only top 5
      } catch (err) {
        console.error(err);
      }
    };
    fetchTopProducts();
  }, []);

  return (
    <div className="bg-white dark:bg-dark p-6 rounded-xl shadow-lg mt-6">
      <h2 className="font-bold text-xl mb-5 text-gray-800 dark:text-light">
        Top Selling Products
      </h2>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between bg-primary/10 dark:bg-light/10 p-3 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Product Image */}
            <div className="w-16 h-16 relative shrink-0">
              {product.images?.[0]?.url ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="bg-gray-300 dark:bg-gray-600 w-full h-full rounded-lg" />
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 ml-4">
              <p className="font-semibold text-gray-800 dark:text-light">
                {product.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Qty Available: {product.quantity}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Sold: {product.totalSold}
              </p>
            </div>

            {/* Price */}
            <p className="font-bold text-gray-900 dark:text-light">
              Rs.{Number(product.price).toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
