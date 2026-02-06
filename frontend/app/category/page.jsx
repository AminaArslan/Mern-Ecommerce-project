'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import ProductCard from '@/componenets/user/products/productCard';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

export default function ShopAllPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);

  // Sorting & Filtering State
  const [sort, setSort] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [openSort, setOpenSort] = useState(false);

  // Categories list (Dynamic)
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch Categories
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        // Add "All" & "New" options
        setCategories([
          { _id: 'All', name: 'All', slug: 'All' },
          ...data,
          { _id: 'new', name: 'New Arrivals', slug: 'new' }
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback
        setCategories([
          { _id: 'All', name: 'All', slug: 'All' },
          { _id: 'new', name: 'New Arrivals', slug: 'new' }
        ]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let params = { limit: 20 };

        // Sorting
        params.sort = 'createdAt';
        params.order = 'desc';
        if (sort === 'price_low') { params.sort = 'price'; params.order = 'asc'; }
        if (sort === 'price_high') { params.sort = 'price'; params.order = 'desc'; }

        // Filtering
        if (selectedCategory !== 'All' && selectedCategory !== 'new') {
          params.category = selectedCategory; // Sending SLUG now
        }

        // Price Filter
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
    }, 500); // Debounce price input

    return () => clearTimeout(timeoutId);
  }, [sort, selectedCategory, minPrice, maxPrice]);


  const clearFilters = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  const isFiltered = selectedCategory !== 'All' || minPrice !== '' || maxPrice !== '' || sort !== 'newest';

  return (
    <main className="w-full bg-[#f0f0f0] pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-2 md:px-6 max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-gray-100 pb-10 md:pb-6 gap-8 relative text-center md:text-left">
          <div className="pt-4 md:pt-0">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-3 block font-serif italic">
              Studio Amina
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-dark leading-none uppercase tracking-tight">
              {categories.find(c => c.slug === selectedCategory)?.name || 'The Curation'}
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 self-center md:self-end">
            <div className="flex items-center gap-6">
              <span className="hidden md:block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {products.length} Pieces Found
              </span>

              {/* Sort Dropdown - Desktop + Mobile Unified Position */}
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

        {/* 🏔️ VISUAL SUB-CATEGORY RIBBON (Appears when Main Category is selected) */}
        {selectedCategory !== 'All' && selectedCategory !== 'new' && (
          <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center justify-between mb-8">
              {/* <h2 className="text-[11px] font-bold text-dark uppercase tracking-[0.4em]">Refine the Boutique</h2>  */}
              <div className="h-px flex-1 bg-dark/5 ml-8 hidden md:block"></div>
            </div>

            <div className="flex items-start justify-center flex-wrap md:flex-nowrap gap-6 md:gap-10 md:overflow-x-auto pb-6 scrollbar-hide md:-mx-4 md:px-4 md:mask-fade">
              {categories
                .find(c => c.slug === selectedCategory)?.subCategories?.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => {
                      router.push(`/category/${sub.slug}`);
                    }}
                    className="flex flex-col items-center gap-4 group cursor-pointer shrink-0"
                  >
                    <div className="relative w-24 h-24 md:w-30 md:h-30 rounded-full border-2 border-transparent group-hover:border-amber-400/30 transition-all duration-500 p-1">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-2xl group-hover:shadow-amber-400/20 transition-all duration-500 border border-gray-100">
                        {sub.previewImage || sub.image ? (
                          <img
                            src={sub.previewImage || sub.image}
                            alt={sub.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200 uppercase font-serif italic text-2xl group-hover:text-amber-400 transition-colors">
                            {sub.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    </div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] group-hover:text-dark transition-all duration-500 text-center group-hover:translate-y-1">
                      {sub.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="flex gap-12 items-start">

          {/* SIDEBAR FILTERS (Desktop) */}
          <aside className="hidden md:block w-64 shrink-0 sticky top-32">
            <div className="space-y-8">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Categories</h3>
                <ul className="space-y-3">
                  {categories.map((cat, i) => (
                    <li key={i}>
                      <button
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`text-sm hover:text-dark transition-colors block cursor-pointer ${selectedCategory === cat.slug ? 'text-dark font-medium underline underline-offset-4' : 'text-gray-500'}`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Price Range</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-20 pl-6 pr-2 py-1 text-sm border border-gray-200 outline-none focus:border-dark transition-colors"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-20 pl-6 pr-2 py-1 text-sm border border-gray-200 outline-none focus:border-dark transition-colors"
                    />
                  </div>
                </div>
              </div>
              {/* Clear Filter Button */}
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-xs font-bold uppercase tracking-widest border border-dark text-dark hover:bg-dark hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-2 sm:gap-x-6 gap-y-10 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-3/4 bg-gray-100 rounded-sm" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-2 sm:gap-x-6 gap-y-8 sm:gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Load More */}
            {products.length < total && (
              <div className="mt-20 flex justify-center">
                <button className="px-8 py-3 border border-gray-200 text-sm font-medium uppercase tracking-widest hover:border-dark hover:bg-dark hover:text-white transition-all duration-300 cursor-pointer">
                  Load More
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MOBILE FILTER OVERLAY */}
      {showFilters && (
        <div className="fixed inset-0 bg-white z-200 p-4 md:p-10 animate-in slide-in-from-bottom duration-500 overflow-y-auto">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.5em]">Collections & Filters</span>
            <button onClick={() => setShowFilters(false)} className="text-dark p-2 -mr-2 cursor-pointer"><FiX size={24} /></button>
          </div>

          <div className="space-y-12">
            {/* Categories on Mobile */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-dark/5 pb-2">Collections</h3>
              <ul className="grid grid-cols-2 gap-4">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <button
                      onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false); }}
                      className={`text-[10px] uppercase tracking-widest transition-all duration-300 block text-left cursor-pointer ${selectedCategory === cat.slug ? 'text-dark font-black' : 'text-gray-400'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range on Mobile */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-dark/5 pb-2">Price Range</h3>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-300">Rs.</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full pl-8 pr-2 py-4 text-xs font-bold border border-gray-100 outline-none focus:border-dark transition-colors bg-white shadow-sm"
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-300">Rs.</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-8 pr-2 py-4 text-xs font-bold border border-gray-100 outline-none focus:border-dark transition-colors bg-white shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-dark text-white py-5 text-[11px] font-bold uppercase tracking-widest shadow-2xl hover:bg-amber-400 hover:text-dark transition-all duration-300 cursor-pointer"
              >
                Apply Selections
              </button>
              {isFiltered && (
                <button
                  onClick={() => { clearFilters(); setShowFilters(false); }}
                  className="w-full border border-dark text-dark py-4 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                >
                  Reset Boutique
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
