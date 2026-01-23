'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductsByParentCategoryFrontend } from '@/lib/axios';
import ProductCard from '@/componenets/user/products/productCard';
import Head from 'next/head';

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProductsByParentCategoryFrontend(slug);
        setProducts(data);

        // Extract unique subcategories from products
        const subsMap = new Map();
        data.forEach((p) => {
          if (p.category && !subsMap.has(p.category.slug)) {
            subsMap.set(p.category.slug, p.category);
          }
        });

        // Sort subcategories alphabetically
        const subs = Array.from(subsMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setSubCategories(subs);
      } catch (err) {
        console.error(err);
        setError('Failed to load products for this category');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  if (loading) return <p className="text-center mt-12">Loading products...</p>;
  if (error) return <p className="text-red-500 text-center mt-12">{error}</p>;

  return (
    <>
      <Head>
        <title>{slug.toUpperCase()} | MyStore</title>
        <meta
          name="description"
          content={`Shop all products under ${slug} category`}
        />
        <link rel="canonical" href={`/category/${slug}`} />
      </Head>

      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{slug.toUpperCase()}</h1>

        {/* Subcategories */}
        {subCategories.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => router.push(`/category/${sub.slug}`)}
                className="px-4 py-2 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition cursor-pointer"
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
