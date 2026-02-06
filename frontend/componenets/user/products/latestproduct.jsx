'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import ProductCard from './productCard';
import Link from 'next/link';

export default function LatestProducts({ title = " Our Latest Arrivals", limit = 4 }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products', {
          params: { sort: 'createdAt', order: 'desc', limit: 100 } // fetch more
        });
        setFeaturedProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [limit]);

  if (!featuredProducts.length) return null;

  return (
    <section className="w-full py-12 lg:py-26">
      <div className="container mx-auto px-3 md:px-4">
        <div className='mb-14 flex flex-col justify-center items-center'>
          <span className=" font-medium text-base mb-6 text-gray-600 relative group inline-block cursor-pointer uppercase underline underline-offset-4">
            {title}
            {/* <span className="absolute left-0 -bottom-2 h-1 w-0 bg-gray-900 transition-all duration-500 group-hover:w-full"></span> */}
          </span>
          <h1 className=' font-normal text-center lg:text-4xl md:text-3xl sm:text-2xl text-xl'>
            Wear pieces that don’t just match your<br className='hidden lg:flex' /> outfit — they match your energy.
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {featuredProducts.slice(0, limit).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {featuredProducts.length > limit && (
          <div className="text-center flex items-center justify-center mt-12">
            <Link href="/products">
              <button className="group relative px-8 py-3 overflow-hidden bg-white text-dark border border-dark transition-all duration-300 hover:border-transparent cursor-pointer">
                <span className="absolute inset-0 w-full h-full bg-dark scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out"></span>
                <span className="relative z-10 flex items-center gap-3 text-sm md:text-base font-medium tracking-widest uppercase group-hover:text-white transition-colors duration-300">
                  View All Products
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
