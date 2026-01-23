'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import ProductCard from './productCard';
import Link from 'next/link';

export default function LatestProducts({ title = "New Arrival", limit = 4 }) {
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
    <section className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl  font-bold mb-16 text-gray-900 relative group inline-block cursor-pointer">
          {title}
             <span className="absolute left-0 -bottom-2 h-1 w-0 bg-gray-900 transition-all duration-500 group-hover:w-full"></span>
        </h2>

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
