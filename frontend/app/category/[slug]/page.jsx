  'use client';

  import { useState, useEffect } from 'react';
  import { useParams, useRouter } from 'next/navigation';
  import axios from '@/lib/axios';
  import Head from 'next/head';
  import ProductCard from '@/componenets/productCard';

  export default function CategoryPage() {
    const { slug } = useParams(); // category slug
    const router = useRouter();

    const [category, setCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 12; // products per page

    useEffect(() => {
      const fetchCategoryData = async () => {
        setLoading(true);
        setError('');
        try {
          // 1️⃣ Fetch all active categories
          const { data: categories } = await axios.get('/categories/users'); // getCategoriesForUsers API

          // 2️⃣ Find current category by slug
          const currentCat = categories.find((c) => c.slug === slug);
          if (!currentCat) {
            setError('Category not found');
            return;
          }
          setCategory(currentCat);

          // 3️⃣ Get subcategories
          const subs = categories.filter((c) => c.parentName === currentCat.name);
          setSubCategories(subs);

          // 4️⃣ Fetch products under this category
          const { data: prodData } = await axios.get('/products', {
            params: { category: slug, page, limit },
          });
          setProducts(prodData.products || []);
          setTotalPages(prodData.totalPages || Math.ceil((prodData.total || 0) / limit));
        } catch (err) {
          console.error(err);
          setError('Failed to load category or products');
        } finally {
          setLoading(false);
        }
      };

      fetchCategoryData();
    }, [slug, page]);

    if (loading && !category) return <p className="text-center mt-12">Loading category...</p>;
    if (error) return <p className="text-red-500 text-center mt-12">{error}</p>;

    return (
      <>
        <Head>
          <title>{category.name} | MyStore</title>
          <meta
            name="description"
            content={category.metaDescription || `Shop products under ${category.name}`}
          />
          <link rel="canonical" href={`/category/${category.slug}`} />
        </Head>

        <div className="space-y-6 p-4 md:p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {category.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {category.metaDescription && <p className="text-gray-600">{category.metaDescription}</p>}

          {/* ---------------- Subcategories ---------------- */}
          {subCategories.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Subcategories</h2>
              <div className="flex flex-wrap gap-3">
                {subCategories.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => router.push(`/category/${sub.slug}`)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- Products ---------------- */}
          {loading ? (
            <p className="text-center mt-6">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center mt-6 text-gray-500">No products found in this category.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* ---------------- Pagination ---------------- */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded ${
                    page === p
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
