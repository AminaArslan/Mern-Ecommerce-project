  'use client';
  import { useState,useEffect } from 'react';

  import Link from 'next/link';
  import {
    FiPlus,
    FiMinus,
    FiHome,
    FiGrid,
    FiShoppingBag,
    FiInfo,
    FiPhone,
    FiHelpCircle,
    FiX,
    FiUser, FiLogIn, FiLogOut
  } from 'react-icons/fi';
  import { useAuth } from '@/context/authContext';
  import API from '@/lib/axios';
  import toast from 'react-hot-toast';

  export default function Sidebar({ open, onClose, }) {
  const { user, logout } = useAuth();
    const [openCollection, setOpenCollection] = useState(false);
    const [openShop, setOpenShop] = useState(false);
    
      const [categories, setCategories] = useState([]); // all categories
    const [parentCategories, setParentCategories] = useState([]); // only top-level
    const [subCategories, setSubCategories] = useState([]); // filtered subcategories
    const [activeParent, setActiveParent] = useState(null); // hovered parent category
    const [loading, setLoading] = useState(true);


      // ---------------- FETCH CATEGORIES ----------------
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data);

        // extract top-level parent categories
        const parents = data.filter(c => !c.parentId && c.isActive);
        setParentCategories(parents);

        // set first parent as active
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

    // ---------------- UPDATE SUBCATEGORIES ----------------
  useEffect(() => {
    if (!activeParent) {
      setSubCategories([]);
      return;
    }

    const subs = categories.filter(cat => cat.parentId === activeParent._id && cat.isActive);
    setSubCategories(subs);
  }, [activeParent, categories]);



  if (loading) return <p className="text-center mt-5">Loading categories...</p>;

    return (
      <>
        {/* ================= OVERLAY ================= */}
        {open && (
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}

        {/* ================= SIDEBAR ================= */}
        <aside
          className={`fixed top-0 left-0 h-screen sm:w-100 w-74 bg-primary text-dark
          flex flex-col shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden`}
        >

          {/* ================= HEADER / LOGO ================= */}
          <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-deep">
            <div className="flex items-center gap-3">
              <Link href={"/"}>
              <img
                src="/logo2.jpg"
                alt="Logo"
                className="w-10 h-10 rounded-full ring-2 ring-accent"
              />
              <h2 className="text-lg font-bold tracking-wide">MyStore</h2>
              </Link>
            </div>

            <button onClick={onClose} className="text-2xl cursor-pointer">
              <FiX />
            </button>
            
          </div>

          {/* ================= MENU ================= */}
          <nav className="flex-1 px-4 py-6 space-y-2 text-sm font-medium overflow-y-auto">

            {/* Home */}
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition"
            >
              <FiHome /> Home
            </Link>

            {/* ================= COLLECTION ================= */}
            <button
              onClick={() => setOpenCollection(!openCollection)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary transition cursor-pointer"
            >
              <span className="flex items-center gap-3 ">
                <FiGrid /> Collection
              </span>
              {openCollection ? <FiMinus /> : <FiPlus />}
            </button>

            {openCollection && (
              <div className="ml-6 space-y-1">
                {['Men', 'Women', 'Kids'].map(item => (
                  <Link
                    key={item}
                    href={`/collections/${item.toLowerCase()}`}
                    onClick={onClose}
                    className="block px-4 py-2 rounded-md text-sm opacity-80 hover:bg-accent hover:text-light transition cursor-pointer"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}

            {/* ================= SHOP ================= */}
            <button
              onClick={() => setOpenShop(!openShop)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary transition cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <FiShoppingBag /> Shop
              </span>
              {openShop ? <FiMinus /> : <FiPlus />}
            </button>

            {openShop && (
              <div className="ml-6 space-y-4">
                <div>
                  <p className="text-xs uppercase opacity-60 mb-2">Categories</p>
  {parentCategories.map(parent => {
    const isActive = activeParent?._id === parent._id;

    // Filter subcategories dynamically
    const subs = categories.filter(cat => cat.parentId === parent._id && cat.isActive);

    return (
      <div key={parent._id}>
        <button
          onClick={() => setActiveParent(isActive ? null : parent)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-md hover:bg-secondary transition cursor-pointer"
        >
          <span>{parent.name}</span>
          {isActive ? <FiMinus size={14} /> : <FiPlus size={14} />}
        </button>

        {isActive && (
          <div className="ml-4 mt-1 space-y-1">
            {subs.length > 0 ? (
              subs.map(sub => (
                <Link
                  key={sub._id}
                  href={`/category/${sub.slug}`}
                  onClick={onClose}
                  className="block px-4 py-2 rounded-md text-sm opacity-80 hover:bg-accent hover:text-light transition"
                >
                  {sub.name}
                </Link>
              ))
            ) : (
              <p className="px-4 py-2 text-xs opacity-60">No sub categories</p>
            )}
          </div>
        )}
      </div>
    );
  })}

                </div>

                <div>
                  <p className="text-xs uppercase opacity-60 mb-2">Discover</p>
                  {[
                    ['Best Sellers', '/collections/best-sellers'],
                    ['New Arrivals', '/collections/new-arrivals'],
                    ['Trending', '/collections/trending'],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={onClose}
                      className="block px-4 py-2 rounded-md text-sm hover:bg-accent hover:text-light transition"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* My Orders */}
            <Link
              href="/orders"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition"
            >
              <FiShoppingBag /> My Orders
            </Link>
          </nav>

          {/* ================= FOOTER ================= */}
          <div className="border-t border-deep  sm:px-4 py-4 text-sm space-y-2">
      <div className='flex items-center justify-between '>
    {/* ---------- STATIC LINKS ---------- */}
    <Link
      href="/pages/about-us"
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition"
    >
      <FiInfo /> About Us
    </Link>

    <Link
      href="/pages/contact-us"
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition"
    >
      <FiPhone /> Contact Us
    </Link>

    <Link
      href="/pages/faq"
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition"
    >
      <FiHelpCircle /> FAQ
    </Link>
    </div>

    {/* ---------- USER SECTION (MOBILE ONLY) ---------- */}
    <div className="md:hidden border-t border-deep pt-3 mt-3">

      {user ? (
        <>
          {/* User Info */}
          <div className="flex items-center gap-3 px-4 py-2 opacity-90">
            <FiUser />
            <span className="text-sm truncate">
              {user.email || user._id}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition text-left cursor-pointer"
          >
            <FiLogOut /> Logout
          </button>
        </>
      ) : (
        <Link
          href="/login"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition cursor-pointer"
        >
          <FiLogIn /> Login
        </Link>
      )}

    </div>
  </div>

        </aside>
      </>
    );
  }
