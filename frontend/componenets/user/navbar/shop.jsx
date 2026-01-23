'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import API from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { FiChevronDown, FiStar, FiClock, FiTrendingUp, FiTag } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { getProductsByParentCategoryFrontend } from '@/lib/axios';

export default function MegaMenu() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]); // all categories
  const [parentCategories, setParentCategories] = useState([]); // top-level only
  const [subCategories, setSubCategories] = useState([]); // filtered subcategories with products
  const [activeParent, setActiveParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);

      const parents = data.filter(c => !c.parentId && c.isActive);
      setParentCategories(parents);
      setActiveParent(parents[0] || null);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch subcategories that have products whenever activeParent changes
  useEffect(() => {
    if (!activeParent) {
      setSubCategories([]);
      return;
    }

    const fetchSubcategoriesWithProducts = async () => {
      try {
        const data = await getProductsByParentCategoryFrontend(activeParent.slug || activeParent._id);

        // Extract unique subcategories that have products
        const subsMap = new Map();
        data.forEach(p => {
          if (p.category && !subsMap.has(p.category.slug)) {
            subsMap.set(p.category.slug, p.category);
          }
        });

        const subs = Array.from(subsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
        setSubCategories(subs);
      } catch (err) {
        console.error('Failed to fetch subcategories products', err);
        setSubCategories([]);
      }
    };

    fetchSubcategoriesWithProducts();
  }, [activeParent]);

  // Close menu on ESC
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (loading) return <p className="text-dark text-center mt-5">Loading...</p>;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1 hover:text-accent transition cursor-pointer"
      >
        Shop
        <FiChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      <div
        className={`border-dark border-2 absolute top-full mt-7  xl:-translate-x-[47%]   -translate-x-[46.5%] w-[90vw] max-w-7xl h-[60vh] md:h-[55vh] 
        bg-primary/95 backdrop-blur-md border-t border-deep shadow-2xl rounded-b-xl z-50 transition-all duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div className="h-full grid grid-cols-12 gap-8 px-6 py-8">
          {/* LEFT: Parent Categories */}
          <div className="col-span-4">
            <h3 className="px-4 text-sm font-bold mb-5 uppercase tracking-wider opacity-70 text-dark">Categories</h3>
<div className="space-y-1">
  {parentCategories.map(parent => (
    <button
      key={parent._id}
      onMouseEnter={() => setActiveParent(parent)}
      className={`w-full text-left px-4 py-2 rounded-md text-sm transition cursor-pointer
        ${
          activeParent?._id === parent._id
            ? 'bg-accent text-light shadow-md'
            : 'text-dark hover:bg-secondary hover:text-light'
        }`}
    >
      {parent.name}
    </button>
  ))}
</div>

          </div>

          {/* MIDDLE: Subcategories */}
          <div className="col-span-4">
            <h3 className="px-4 text-sm font-bold mb-5 uppercase tracking-wider opacity-70 text-dark">
              {activeParent?.name || 'Sub Categories'}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {subCategories.length > 0 ? (
                subCategories.map(sub => (
                  <button
                    key={sub._id}
                    onClick={() => { router.push(`/category/${sub.slug}`); setOpen(false); }}
                    className="px-4 py-2 rounded-md text-sm text-dark transition text-left cursor-pointer"
                  >
                    {sub.name}
                  </button>
                ))
              ) : (
                <p className="text-sm opacity-60">No sub categories available</p>
              )}
            </div>
          </div>

          {/* RIGHT: Discover */}
          <div className="col-span-3">
            <h3 className="text-sm font-bold mb-5 uppercase tracking-wider opacity-70 text-dark">Discover</h3>
            <div className="space-y-4">
              {[
                { icon: <FiStar />, label: 'Best Sellers', href: '/collections/best-sellers' },
                { icon: <FiClock />, label: 'New Arrivals', href: '/collections/new-arrivals' },
                { icon: <FiTrendingUp />, label: 'Trending', href: '/collections/trending' },
                { icon: <FiTag />, label: 'Discounts', href: '/collections/discount' },
              ].map(({ icon, label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary hover:bg-accent hover:text-light transition"
                >
                  {icon} <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
