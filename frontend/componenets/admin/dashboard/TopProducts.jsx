'use client';
import { useEffect, useState } from 'react';
import { getTopProductsStats } from '@/lib/axios';
import Image from 'next/image';
import { FiTrendingUp } from 'react-icons/fi';

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
    <div className="bg-white p-6 rounded-sm shadow-xl border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
        <h2 className="font-serif text-xl font-bold text-dark">
          Top Selling
        </h2>
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
          <FiTrendingUp size={18} />
        </div>
      </div>

      <div className="space-y-6">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 -mx-3 rounded-sm hover:bg-gray-50 transition-colors duration-200 cursor-default gap-3 sm:gap-0"
          >
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Rank */}
              <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{index + 1}</span>

              {/* Product Image */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 relative shrink-0 shadow-sm rounded-sm overflow-hidden border border-gray-100">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="bg-gray-100 w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No Img
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <p className="text-sm font-bold text-dark group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {product.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {product.quantity} Stock
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {product.totalSold} Sold
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="w-full sm:w-auto flex justify-between sm:block pl-10 sm:pl-0">
              <span className="sm:hidden text-xs font-bold text-gray-400 uppercase tracking-widest">Price</span>
              <p className="font-serif font-bold text-dark text-sm">
                Rs.{Number(product.price).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-xs uppercase tracking-widest">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
