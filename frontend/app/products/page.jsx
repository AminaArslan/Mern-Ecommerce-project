'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios.js';
import { useSearchParams, useRouter } from 'next/navigation';
// import ProductCard from '@/componenets/productCard';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [activeParent, setActiveParent] = useState(null);

  // Pagination & search
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  // ---------------- Build nested category tree ----------------
  const buildCategoryTree = (cats) => {
    const map = {};
    const roots = [];

    cats.forEach(c => map[c._id] = { ...c, children: [] });

    cats.forEach(c => {
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

  // ---------------- Fetch categories & products ----------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        setCategories(buildCategoryTree(data || []));
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/products', {
          params: {
            page,
            limit: 12,
            search,
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

    fetchCategories();
    fetchProducts();
  }, [page, search, selectedCategory]);

  // ---------------- Render ----------------
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Search & Categories */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border p-2 rounded flex-1"
        />

        {/* Categories Menu */}
        <div className="flex space-x-4 relative">
          {categories.map((parent) => (
            <div
              key={parent._id}
              className="relative"
              onMouseEnter={() => setActiveParent(parent._id)}
              onMouseLeave={() => setActiveParent(null)}
            >
              {/* Parent Button */}
              <button
                onClick={() => setSelectedCategory(parent._id)}
                className={`px-4 py-2 rounded hover:bg-gray-100 font-semibold ${
                  selectedCategory === parent._id ? 'bg-blue-100' : ''
                }`}
              >
                {parent.name}
              </button>

              {/* Subcategories */}
              {parent.children.length > 0 && activeParent === parent._id && (
                <div className="absolute left-0 mt-2 bg-white shadow-lg border rounded min-w-37.5 z-10">
                  {parent.children.map((child) => (
                    <button
                      key={child._id}
                      onClick={() => setSelectedCategory(child._id)}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        selectedCategory === child._id ? 'bg-blue-100' : ''
                      }`}
                    >
                      {child.name}
                    </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow hover:shadow-md transition overflow-hidden"
            >
              {/* Images */}
              {product.images?.length > 0 ? (
                <div className="grid grid-cols-2 gap-1 p-1">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="w-full h-24 overflow-hidden rounded">
                      <img
                        src={img.url}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-24 flex items-center justify-center bg-gray-100 text-gray-400">
                  No image
                </div>
              )}

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-semibold text-md">{product.name}</h3>
                <p className="text-gray-600">${product.price?.toFixed(2) || 'N/A'}</p>
              </div>
            </div>
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
