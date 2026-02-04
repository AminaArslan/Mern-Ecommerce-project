'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import API from '@/lib/axios';
import {
  FiMenu,
  FiX,
  FiUser,
  FiShoppingCart,
  FiChevronDown,
  FiSun,
  FiMoon,
} from 'react-icons/fi';
import MegaMenu from './shop';
import CollectionMenu from './collection';
import PagesDropdown from './pages';
import Sidebar from '../sidebar';
import CartSidebar from '../cart/cart';


export default function Navbar() {
  const { user, logout } = useAuth();
   const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
 const [categories, setCategories]= useState();
 const [activeCategory, setActiveCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data);
        setActiveCategory(data?.[0] || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // ---------------- CLOSE MOBILE MENU ON ESC ----------------
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ---------------- USER DROPDOWN CLICK OUTSIDE ----------------
  const userDropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ---------------- THEME TOGGLE ---------------- */
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };



  return (
    <>
      <header className=" text-light bg-deep sticky top-0 z-50 ">
        <div className="container mx-auto flex items-center justify-between md:flex-row flex-row-reverse h-20 px-4">

          <div className='flex item items-center gap-4'>

{/* Mobile Cart Button */}
<button
  onClick={() => setCartOpen(true)}
  className="md:hidden relative hover:text-accent transition cursor-pointer "
>
  <FiShoppingCart size={20} />
{cart?.length > 0 && (
  <span className="badge -top-2 -right-2">{cart.length}</span>
)}
</button>

{/* Cart Sidebar */}
<CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />


            {/* <button
              onClick={toggleTheme}
              className="md:hidden  text-xl hover:text-accent transition cursor-pointer"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button> */}
            <button
              className="lg:hidden sm:text-2xl text-xl cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>

          </div>
          {/* ================= LEFT : LOGO ================= */}
          <div className="lg:flex-1 flex  justify-between">
            <Link href="/" className="flex items-center lg:justify-baseline  gap-3 group">
            <img src="/logo2.jpg"
             alt="MyStore" 
             onError={(e)=>e.target.src='/placeholder.png'}
                className=" w-9 h-9   sm:w-11 sm:h-11 rounded-full object-cover shadow-md ring-2 ring-accent group-hover:scale-105 transition"
              />
              <div className="leading-tight">
                <h1 className="sm:text-lg font-bold tracking-wide text-light">
                  MyStore
                </h1>
                <p className="text-[11px] opacity-70">Online Shopping</p>
              </div>
            </Link>
          </div>

          {/* ================= CENTER : NAV LINKS ================= */}

          <nav className=" lg:flex-2 hidden lg:flex justify-center items-center gap-8 xl:gap-10 text-sm font-semibold">

            <Link href="/" className="hover:text-accent transition">
              Home
            </Link>
            <div className="relative group">
              <CollectionMenu />
            </div>


            {/* ========== SHOP MEGA MENU ========== */}
            <div className="relative group">
              <MegaMenu />
            </div>

            <div className="relative group">
              <PagesDropdown />
            </div>

          {user && (
        <Link href="/orders" className="hover:text-accent transition">
          My Orders
        </Link>
      )}


          </nav>

          {/* ================= RIGHT : ICONS ================= */}
          <div className="hidden md:flex lg:flex-1 justify-end items-center gap-6">

            {/* USER DROPDOWN DESKTOP */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(p => !p)}
                className="flex items-center gap-1 hover:text-accent transition cursor-pointer"
              >
                <FiUser size={18} />
                <FiChevronDown
                  className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-lg shadow-lg bg-primary border border-deep z-50">
                  {user ? (
                    <div className="flex flex-col">
                      <div className="px-4 py-2 text-sm text-dark opacity-80 border-b border-deep truncate">
                        {user.email || user._id}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-sm hover:bg-accent hover:text-light rounded-b-lg transition text-left cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-accent hover:text-light rounded-lg transition cursor-pointer"
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>


            {/* CART */}
            <button  
              onClick={() => setCartOpen(true)}
            className="relative hover:text-accent transition cursor-pointer">
               <FiShoppingCart size={20} />
  {cart.length > 0 && (
    <span className="badge -top-2 -right-2">
      {cart.length}
    </span>
  )}
            </button>

            {/* THEME */}
            {/* <button
              onClick={toggleTheme}
              className="text-lg hover:text-accent transition cursor-pointer"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button> */}
          </div>

        </div>

      </header>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>

  );
}
