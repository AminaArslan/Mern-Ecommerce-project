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
      <div className="container mx-auto px-4">
        <div className='mb-14 flex flex-col justify-center items-center'> 
        <span className=" font-medium text-base mb-6 text-gray-600 relative group inline-block cursor-pointer uppercase underline underline-offset-4">
          {title}
             {/* <span className="absolute left-0 -bottom-2 h-1 w-0 bg-gray-900 transition-all duration-500 group-hover:w-full"></span> */}
        </span>
        <h1 className=' font-normal text-center lg:text-4xl md:text-3xl sm:text-2xl text-xl'>
          Wear pieces that don’t just match your<br className='hidden lg:flex'/> outfit — they match your energy.
        </h1>
         </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {     featuredProducts.slice(0, limit).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {featuredProducts.length > limit && (
          <div className="text-center flex items-center justify-end  mt-8">
            <Link href="/products">
              <button className="btn-primary">See More Products</button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
