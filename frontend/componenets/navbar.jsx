'use client';

import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Don't render navbar for admins
  if (user?.role === 'admin') return null;

  return (
    <header className="bg-primary text-light shadow-md sticky top-0 z-50 transition">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide hover:text-deep transition"
        >
          MyStore
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center font-semibold">
          <Link href="/products" className="hover:text-accent transition">
            Products
          </Link>
          <Link href="/orders" className="hover:text-accent transition">
            My Orders
          </Link>

          {user ? (
            <>
              <span className="ml-4 font-semibold text-deep">{user.name}</span>
              <button
                onClick={logout}
                className="ml-2 px-4 py-2 rounded bg-accent hover:bg-dark text-light transition hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-4 px-4 py-2 rounded bg-accent hover:bg-dark text-light transition hover:scale-105"
            >
              Login
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="ml-4 relative hover:scale-110 transition">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-light rounded-full w-5 h-5 text-xs flex items-center justify-center animate-bounce">
                {cart.length}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-xl hover:text-deep transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-primary text-light shadow-md px-6 space-y-3 transform transition-all duration-300
          ${menuOpen ? 'opacity-100 max-h-96 py-4' : 'opacity-0 max-h-0 overflow-hidden'}
        `}
      >
        <Link href="/products" className="block hover:text-accent transition">
          Products
        </Link>
        <Link href="/orders" className="block hover:text-accent transition">
          My Orders
        </Link>

        {user ? (
          <>
            <span className="block font-semibold text-deep">{user.name}</span>
            <button
              onClick={logout}
              className="w-full px-4 py-2 rounded bg-accent hover:bg-dark text-light transition hover:scale-105"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="block w-full px-4 py-2 rounded text-center bg-accent hover:bg-dark text-light transition hover:scale-105"
          >
            Login
          </Link>
        )}

        <Link href="/cart" className="block relative hover:scale-105 transition">
          🛒 Cart
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-accent text-light rounded-full w-5 h-5 text-xs flex items-center justify-center animate-bounce">
              {cart.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
