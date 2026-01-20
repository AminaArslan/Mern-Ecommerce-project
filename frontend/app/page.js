'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import CategoryList from '@/componenets/categoryList';
import ProductCard from '@/componenets/productCard';
import HeroCarousel from '@/componenets/hero';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch featured products
const fetchProducts = async () => {
  try {
    const { data } = await axios.get('/products', {
      params: { featured: true, limit: 4 } // adjust as needed
    });

    // Use the products array inside the returned object
    setFeaturedProducts(data.products || []); 
  } catch (err) {
    console.error(err);
  }
};


    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories?active=true');
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
         <HeroCarousel/>
      {/* Categories Section */}
      <section>
        <CategoryList categories={categories} />
      </section>

      {/* Featured Products Section */}
     <section className="w-full py-12 md:py-20">\
      <div className='max-w-7xl mx-auto px-4'>
         <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">Featured Products</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
    {featuredProducts.slice(0, 6).map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>

  {featuredProducts.length > 6 && (
    <div className="text-center mt-8">
      <Link href="/products">
        <button className="btn-primary">See More Products</button>
      </Link>
    </div>
  )}
  </div>
</section>


    </div>
  );
}
