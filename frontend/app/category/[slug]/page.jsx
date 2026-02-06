'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios, { getProductsByParentCategoryFrontend } from '@/lib/axios';
import ProductCard from '@/componenets/user/products/productCard';
import Head from 'next/head';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [parentName, setParentName] = useState('');

  // Filtering & Sorting State
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [openSort, setOpenSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!slug) return;

    const fetchContent = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch Products for this slug (with filters)
        let params = { limit: 50 };
        params.sort = 'createdAt';
        params.order = 'desc';
        if (sort === 'price_low') { params.sort = 'price'; params.order = 'asc'; }
        if (sort === 'price_high') { params.sort = 'price'; params.order = 'desc'; }

        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const data = await getProductsByParentCategoryFrontend(slug, params);
        setProducts(data);

        // 2. Fetch Category Hierarchy to find siblings/children
        const { data: allCats } = await axios.get('/categories');

        let currentCat = null;
        // Find current category in the flat list or hierarchy
        allCats.forEach(parent => {
          if (parent.slug === slug) currentCat = parent;
          parent.subCategories?.forEach(sub => {
            if (sub.slug === slug) currentCat = sub;
          });
        });

        if (currentCat) {
          if (!currentCat.parentId) {
            // It's a PARENT category (Men, Women, Kids)
            setSubCategories(currentCat.subCategories || []);
            setParentName(currentCat.name);
          } else {
            // It's a SUB-CATEGORY (Shirts, Dresses, etc.)
            // Find the actual parent object to get siblings
            const parent = allCats.find(p => p._id === currentCat.parentId);
            if (parent) {
              setSubCategories(parent.subCategories || []);
              setParentName(parent.name);
            }
          }
        }

      } catch (err) {
        console.error(err);
        setError('Failed to load pieces for this collection.');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchContent();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [slug, sort, minPrice, maxPrice]);

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  const isFiltered = minPrice !== '' || maxPrice !== '' || sort !== 'newest';

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="space-y-4 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.6em] animate-pulse">Archiving Boutique Pieces</p>
        <div className="w-12 h-px bg-dark mx-auto"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center space-y-6">
        <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">{error}</p>
        <button onClick={() => router.push('/category')} className="text-[10px] font-bold uppercase tracking-widest border-b border-dark pb-1 text-dark cursor-pointer">Return to collections</button>
      </div>
    </div>
  );

  return (
    <main className="w-full bg-[#f8f8f8] pt-24 pb-32 min-h-screen">
      <Head>
        <title>{parentName || slug.replace('-', ' ')} | Studio Amina</title>
      </Head>

      <section className="container mx-auto px-6 max-w-7xl pt-12">

        {/* HEADER & MOBILE SORT/FILTER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-dark/5 pb-10 gap-8 text-center md:text-left">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.5em] mb-4 block font-serif italic">Archive Collection</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-dark tracking-tight uppercase leading-none">
              {parentName || slug.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 self-center md:self-end">
            <div className="flex items-center gap-6">
              <span className=" hidden sm:block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {products.length} Pieces Found
              </span>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenSort(!openSort)}
                  className="flex items-center gap-2 text-[11px] font-bold text-dark cursor-pointer hover:bg-gray-50 transition-colors uppercase tracking-widest border border-dark/10 px-6 py-3 rounded-sm bg-white shadow-sm"
                >
                  Sort: {sort === 'newest' ? 'New' : sort === 'price_low' ? 'Price ↑' : 'Price ↓'} <FiChevronDown />
                </button>

                {openSort && (
                  <div className="absolute right-0 md:right-0 left-0 md:left-auto top-full mt-2 w-48 bg-white border border-gray-100 shadow-2xl rounded-sm z-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {[
                      { label: 'Newest Arrivals', value: 'newest' },
                      { label: 'Price: Low to High', value: 'price_low' },
                      { label: 'Price: High to Low', value: 'price_high' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSort(option.value); setOpenSort(false); }}
                        className={`block w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 cursor-pointer ${sort === option.value ? 'text-amber-500' : 'text-gray-500'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                className="md:hidden flex items-center gap-2 text-[11px] font-bold text-white border border-dark px-6 py-3 bg-dark uppercase tracking-widest shadow-xl hover:bg-amber-400 hover:text-dark transition-all duration-300 cursor-pointer"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* 🏔️ VISUAL SUB-CATEGORY RIBBON */}
        {subCategories.length > 0 && (
          <div className="mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[11px] font-bold text-dark uppercase tracking-[0.4em]">Refine the Archive</h2>
              <div className="h-px flex-1 bg-dark/5 ml-8 hidden md:block"></div>
            </div>

            <div className="flex items-start justify-center flex-wrap md:flex-nowrap gap-8 md:gap-14 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 mask-fade">
              {subCategories
                .map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => {
                      router.push(`/category/${sub.slug}`);
                    }}
                    className="flex flex-col items-center gap-4 group cursor-pointer shrink-0"
                  >
                    <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 transition-all duration-500 p-1 
                        ${sub.slug === slug ? 'border-amber-400 shadow-xl shadow-amber-400/20' : 'border-transparent group-hover:border-amber-400/30'}
                    `}>
                      <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-2xl group-hover:shadow-amber-400/20 transition-all duration-500 border border-gray-100">
                        {(sub.previewImage || sub.image) ? (
                          <img
                            src={sub.previewImage || sub.image}
                            alt={sub.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200 uppercase font-serif italic text-3xl group-hover:text-amber-400 transition-colors">
                            {sub.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-[0.3em] transition-all duration-500 text-center group-hover:translate-y-1 
                        ${sub.slug === slug ? 'text-dark scale-110' : 'text-gray-400 group-hover:text-dark'}
                    `}>
                      {sub.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="flex gap-16 items-start">
          {/* SIDEBAR FILTERS (Desktop) */}
          <aside className="hidden md:block w-64 shrink-0 sticky top-32">
            <div className="space-y-10">
              {/* Categories */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-dark/5 pb-2">Collections</h3>
                <ul className="space-y-4">
                  {categories.map((cat, i) => (
                    <li key={i}>
                      <button
                        onClick={() => router.push(`/category/${cat.slug}`)}
                        className={`text-[11px] uppercase tracking-widest transition-all duration-300 block hover:translate-x-1 cursor-pointer ${cat.slug === slug || cat.subCategories?.some(s => s.slug === slug) ? 'text-dark font-black translate-x-1' : 'text-gray-400 hover:text-dark'}`}
                      >
                        {cat.name}
                      </button>
                      {(cat.slug === slug || cat.subCategories?.some(s => s.slug === slug)) && (
                        <ul className="ml-4 mt-3 space-y-2 border-l border-dark/5 pl-4">
                          {cat.subCategories?.map(sub => (
                            <li key={sub._id}>
                              <button
                                onClick={() => router.push(`/category/${sub.slug}`)}
                                className={`text-[10px] uppercase tracking-[0.15em] transition-all duration-300 block hover:text-dark cursor-pointer ${sub.slug === slug ? 'text-dark font-black' : 'text-gray-400'}`}
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-dark/5 pb-2">Price Range</h3>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-300">Rs.</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full pl-8 pr-2 py-3 text-[11px] font-bold border border-gray-100 outline-none focus:border-dark transition-colors bg-white shadow-sm"
                    />
                  </div>
                  <span className="text-gray-300">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-300">Rs.</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-8 pr-2 py-3 text-[11px] font-bold border border-gray-100 outline-none focus:border-dark transition-colors bg-white shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filter Button */}
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.3em] border border-dark text-dark hover:bg-dark hover:text-white transition-all duration-500 shadow-sm cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-sm shadow-sm border border-dark/5">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.5em] italic mb-10">This archive is currently empty.</p>
                <button
                  onClick={() => router.push('/category')}
                  className="px-10 py-4 bg-dark text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-amber-400 hover:text-dark transition-all duration-500 shadow-lg cursor-pointer"
                >
                  Return to All Collections
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MOBILE FILTER OVERLAY */}
      {showFilters && (
        <div className="fixed inset-0 bg-white z-200 p-10 animate-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.5em]">Filters</span>
            <button onClick={() => setShowFilters(false)} className="text-dark cursor-pointer"><FiX size={24} /></button>
          </div>
          <div className="space-y-12">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6">Price Range</h3>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="flex-1 border border-gray-100 p-4 text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="flex-1 border border-gray-100 p-4 text-xs font-bold"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-dark text-white py-5 text-[11px] font-bold uppercase tracking-widest shadow-2xl cursor-pointer"
            >
              Apply Selections
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
