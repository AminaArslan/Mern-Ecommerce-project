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
} from 'react-icons/fi';
import PagesDropdown from './pages';
import Sidebar from '../sidebar';
import CartSidebar from '../cart/cart';
import BrandLogo from '../BrandLogo';


export default function Navbar() {
  const { user, logout } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState();
  const [activeCategory, setActiveCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // State for glassmorphism

  /* ---------------- SCROLL EFFECT ---------------- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <>
      {/* 
        💎 Glassmorphism Header 
        - Changes background from transparent/white to blurred glass on scroll 
      */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent
          ${scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-sm border-gray-100 py-3'
            : 'bg-transparent py-6'
          }
        `}
      >
        <div className="container mx-auto flex items-center justify-between px-3 md:px-6">

          {/* ================= LEFT : LOGO ================= */}
          <div className="lg:flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-xl opacity-0 group-hover:opacity-100 transition duration-700 cursor-pointer scale-150"></div>
                <BrandLogo
                  size={48}
                  className="relative transition-all duration-500 transform group-hover:rotate-[360deg] group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col cursor-pointer">
                <h1 className="text-lg md:text-xl font-serif font-bold tracking-tighter text-dark group-hover:text-amber-500 transition duration-300 cursor-pointer leading-none">
                  STUDIO
                </h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold group-hover:text-gray-600 transition-all duration-300">
                  Boutique
                </p>
              </div>
            </Link>
          </div>

          {/* ================= CENTER : NAV LINKS (LG ONLY) ================= */}
          <nav className="hidden lg:flex items-center gap-10 text-sm font-medium tracking-wide text-dark">

            {/* Home with Animated Underline */}
            <Link href="/" className="relative group py-2 cursor-pointer">
              <span className="group-hover:text-accent transition duration-300 cursor-pointer">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Collection Link */}
            <Link href="/category" className="relative group py-2 cursor-pointer">
              <span className="group-hover:text-accent transition duration-300 cursor-pointer">Collection</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Shop Link */}
            <Link href="/products" className="relative group py-2 cursor-pointer">
              <span className="group-hover:text-accent transition duration-300 cursor-pointer">Shop</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Pages Dropdown */}
            <div className="relative group py-2 cursor-pointer">
              <PagesDropdown />
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full cursor-pointer"></span>
            </div>

            {user && (
              <Link href="/orders" className="relative group py-2 cursor-pointer">
                <span className="group-hover:text-accent transition duration-300 cursor-pointer">My Orders</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          {/* ================= RIGHT : ICONS ================= */}
          <div className="flex lg:flex-1 justify-end items-center gap-6">

            {/* USER DROPDOWN (MD+ ONLY) */}
            <div className="hidden md:relative md:block" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(p => !p)}
                className="flex items-center gap-2 text-dark hover:text-accent transition duration-300 group cursor-pointer"
              >
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-accent/10 transition duration-300 cursor-pointer">
                  <FiUser size={18} className="cursor-pointer" />
                </div>
                <FiChevronDown
                  className={`transition-transform duration-300 cursor-pointer ${userDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-4 w-56 rounded-xl shadow-xl bg-white border border-gray-100 overflow-hidden transform origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                  {user ? (
                    <div className="flex flex-col">
                      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="text-sm font-semibold text-dark truncate">{user.email || user._id}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-200 flex items-center gap-2 cursor-pointer"
                      >
                        Let Me Out
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <Link
                        href="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-black transition duration-300 shadow-md hover:shadow-lg"
                      >
                        Login / Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CART */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative group text-dark hover:text-accent transition duration-300 transform hover:scale-110 cursor-pointer"
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-accent/10 transition duration-300">
                <FiShoppingCart size={18} />
              </div>
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md ring-2 ring-white animate-bounce-short">
                  {cart.length}
                </span>
              )}
            </button>

            {/* MOBILE/TABLET SIDEBAR TOGGLE (lg-nichy) */}
            <button
              className="lg:hidden text-2xl cursor-pointer text-dark hover:rotate-180 transition duration-500"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FiMenu />
            </button>
          </div>

        </div>
      </header>

      {/* Cart Sidebar Implementation */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile Menu Sidebar */}
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
