'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import ProductCard from '@/componenets/user/products/productCard';
import { FiChevronDown, FiX, FiSearch } from 'react-icons/fi';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Sorting & Filtering State
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [openFilter, setOpenFilter] = useState(null); // 'cat' | 'price' | 'sort'
  const [page, setPage] = useState(1);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        setCategories([{ _id: 'All', name: 'All', slug: 'All' }, ...data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let params = {
          limit: 12,
          page: page
        };

        // Sorting
        params.sort = 'createdAt';
        params.order = 'desc';
        if (sort === 'price_low') { params.sort = 'price'; params.order = 'asc'; }
        if (sort === 'price_high') { params.sort = 'price'; params.order = 'desc'; }

        // Filters
        if (search) params.search = search;
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const { data } = await axios.get('/products', { params });
        setProducts(data.products || []);
        setTotal(data.total || data.products?.length || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [sort, selectedCategory, minPrice, maxPrice, search, page]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearch('');
    setPage(1);
  };

  const isFiltered = selectedCategory !== 'All' || minPrice !== '' || maxPrice !== '' || sort !== 'newest' || search !== '';

  return (
    <div className="w-full bg-[#f0f0f0] pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-3 md:px-6 max-w-7xl">

        {/* HEADER - CENTERED EDITORIAL */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">
            Global Archive
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-dark leading-none tracking-tighter">
            Explore <span className="italic font-light text-gray-300 underline decoration-1 underline-offset-12">Store.</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase pt-4">
            {total} Handcrafted Pieces
          </p>
        </div>

        {/* TOP FILTER BAR */}
        <div className="sticky top-24 z-40 bg-white/80 backdrop-blur-md border-y border-gray-100 py-4 px-3 md:px-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">

            {/* Search - Minimalist */}
            <div className="relative w-full md:w-96 group">
              <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark group-focus-within:text-accent transition-colors z-10" />
              <input
                type="text"
                placeholder="SEARCH COLLECTION..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-full pl-10 pr-4 py-2.5 text-[10px] font-bold tracking-[0.15em] outline-none focus:bg-white focus:border-dark focus:ring-4 focus:ring-dark/5 transition-all duration-300 placeholder:text-gray-400 text-dark"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-5 sm:gap-10">
              {/* Category Filter */}
              <div className="relative group/drop">
                <button
                  onClick={() => setOpenFilter(openFilter === 'cat' ? null : 'cat')}
                  className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer hover:scale-105 ${selectedCategory !== 'All' ? 'text-accent' : 'text-dark hover:text-gray-600'}`}
                >
                  {selectedCategory === 'All' ? 'Categories' : selectedCategory} <FiChevronDown className={openFilter === 'cat' ? 'rotate-180 transition' : 'transition'} />
                </button>
                {openFilter === 'cat' && (
                  <div className="absolute top-full left-0 mt-6 w-48 bg-white border border-gray-100 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <ul className="space-y-3">
                      {categories.map(cat => (
                        <li key={cat._id}>
                          <button
                            onClick={() => { setSelectedCategory(cat.slug || cat.name); setPage(1); setOpenFilter(null); }}
                            className={`text-[9px] font-bold uppercase tracking-widest hover:text-dark hover:translate-x-1 transition-all duration-300 cursor-pointer ${selectedCategory === (cat.slug || cat.name) ? 'text-dark underline underline-offset-4' : 'text-gray-400'}`}
                          >
                            {cat.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="relative">
                <button
                  onClick={() => setOpenFilter(openFilter === 'price' ? null : 'price')}
                  className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer hover:scale-105 ${minPrice || maxPrice ? 'text-accent' : 'text-dark hover:text-gray-600'}`}
                >
                  Price <FiChevronDown className={openFilter === 'price' ? 'rotate-180 transition' : 'transition'} />
                </button>
                {openFilter === 'price' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-6 w-70 sm:w-64 bg-white border border-gray-100 shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="MIN"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-gray-50 p-2 text-[10px] font-bold outline-none"
                      />
                      <span className="text-gray-200">—</span>
                      <input
                        type="number"
                        placeholder="MAX"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-gray-50 p-2 text-[10px] font-bold outline-none"
                      />
                    </div>
                    <button onClick={() => setOpenFilter(null)} className="w-full mt-4 py-2 bg-dark text-white text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-700 active:scale-95 transition-all duration-300">Apply</button>
                  </div>
                )}
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <button
                  onClick={() => setOpenFilter(openFilter === 'sort' ? null : 'sort')}
                  className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-dark cursor-pointer hover:text-gray-600 hover:scale-105 transition-all duration-300"
                >
                  Sort: {sort.replace('_', ' ')} <FiChevronDown className={openFilter === 'sort' ? 'rotate-180 transition' : 'transition'} />
                </button>
                {openFilter === 'sort' && (
                  <div className="absolute top-full right-0 mt-6 w-48 bg-white border border-gray-100 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <ul className="space-y-3">
                      {[
                        { label: 'Newest', value: 'newest' },
                        { label: 'Price: Low', value: 'price_low' },
                        { label: 'Price: High', value: 'price_high' }
                      ].map(opt => (
                        <li key={opt.value}>
                          <button
                            onClick={() => { setSort(opt.value); setPage(1); setOpenFilter(null); }}
                            className={`text-[9px] font-bold uppercase tracking-widest hover:text-dark hover:translate-x-1 transition-all duration-300 cursor-pointer ${sort === opt.value ? 'text-dark' : 'text-gray-400'}`}
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>

            {/* Reset Button */}
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-dark/70 hover:text-red-500 hover:border-red-500/20 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-105 px-4 py-2 border border-gray-100 rounded-full bg-gray-50/50"
              >
                <FiX size={14} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="min-h-[60vh]">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-3/4 bg-gray-50 rounded-sm" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-50 w-3/4" />
                    <div className="h-3 bg-gray-50 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-6">
              <FiSearch size={40} className="mx-auto text-gray-100" />
              <div>
                <h3 className="text-xl font-serif text-dark mb-1">No pieces found</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Widen your search or reset filters</p>
              </div>
              <button onClick={clearFilters} className="text-[9px] font-bold uppercase tracking-[0.2em] border-b border-dark pb-1 hover:text-accent hover:border-accent transition-all duration-300 cursor-pointer">Show Everything</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 sm:gap-x-6 gap-y-8 sm:gap-y-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {total > 12 && (
          <div className="mt-32 pt-12 border-t border-gray-100 flex items-center justify-center gap-12">
            <button
              disabled={page === 1}
              onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-[10px] font-bold tracking-[0.3em] uppercase disabled:opacity-20 hover:text-accent transition-all cursor-pointer"
            >
              PREV
            </button>

            <div className="flex gap-4">
              {[...Array(Math.ceil(total / 12))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-10 h-10 rounded-full text-[10px] font-bold transition-all duration-300 cursor-pointer hover:scale-110 active:scale-90 ${page === (i + 1) ? 'bg-dark text-white shadow-lg' : 'text-gray-400 hover:text-dark hover:bg-gray-50'}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>

            <button
              disabled={page >= Math.ceil(total / 12)}
              onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-[10px] font-bold tracking-[0.3em] uppercase disabled:opacity-20 hover:text-accent transition-all cursor-pointer"
            >
              NEXT
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
