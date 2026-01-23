'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios.js';
import ProductCard from '@/componenets/user/products/productCard';
import Link from 'next/link';

export default function ProductsPage() {
  // ---------------- States ----------------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeParent, setActiveParent] = useState(null);

  // Filters & pagination
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------- Helpers ----------------
  const buildCategoryTree = (cats) => {
    const map = {};
    const roots = [];

    cats.forEach((c) => (map[c._id] = { ...c, children: [] }));

    cats.forEach((c) => {
      if (c.parentId) {
        const parent = map[c.parentId];
        if (parent) parent.children.push(map[c._id]);
        else roots.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });

    return roots;
  };

  // ---------------- Fetch Categories ----------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        setCategories(buildCategoryTree(data || []));
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // ---------------- Fetch Products ----------------
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/products', {
          params: {
            page,
            limit: 12,
            search: search || undefined,
            category: selectedCategory || undefined,
          },
        });
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory, page]);

  // ---------------- Render ----------------
  return (
    <div className="container mx-auto space-y-6 p-4">

{/* Search & Categories */}
<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
  {/* Search by Product Name */}
  <input
    type="text"
    placeholder="Search product name..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(1);
    }}
    className="border p-2 rounded flex-1"
  />

  {/* Category Buttons */}
  <div className="flex space-x-4 relative">
    {categories.map((parent) => (
      <div
        key={parent._id}
        className="relative"
        onMouseEnter={() => setActiveParent(parent._id)}
        onMouseLeave={() => setActiveParent(null)}
      >
        {/* Parent category button navigates to category page by slug */}
        <Link href={`/category/${parent.slug}`}>
          <button
            className="px-4 py-2 rounded hover:bg-gray-100 font-semibold cursor-pointer"
          >
            {parent.name}
          </button>
        </Link>

        {/* Child categories dropdown (optional) */}
        {parent.children.length > 0 && activeParent === parent._id && (
          <div className="absolute left-0 mt-2 bg-white shadow-lg border rounded min-w-[150px] z-10">
            {parent.children.map((child) => (
              <Link key={child._id} href={`/category/${child.slug}`}>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {child.name}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
</div>


      {/* Products Grid */}
      {loading ? (
        <p className="text-center mt-6">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center mt-6 text-gray-500">No products found.</p>
      ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 mt-4">
  {products.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>

      )}

      {/* Pagination */}
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
  );
}
