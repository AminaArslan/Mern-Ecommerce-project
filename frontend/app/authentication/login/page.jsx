'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import BrandLogo from '@/componenets/user/BrandLogo';

export default function LoginPage() {
  const { login, user } = useAuth();
  const { syncCart } = useCart();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (user?.role === 'admin') {
      console.log('Already logged in as admin, redirecting...');
      router.replace('/admin/dashboard');
    } else if (user) {
      console.log('Already logged in, redirecting...');
      router.replace('/products');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt:', { email, password });

    try {
      const guestId = localStorage.getItem('guestId');
      console.log('GuestId (for cart merge):', guestId);

      const loggedInUser = await login({ email, password, guestId });
      console.log('Login successful:', loggedInUser);

      // Merge guest cart if exists
      if (guestId && typeof window !== 'undefined') {
        const localCartKey = `cart_${guestId}`;
        const localCart = JSON.parse(localStorage.getItem(localCartKey) || '[]');
        console.log('Local cart before sync:', localCart);

        if (localCart.length > 0) {
          const syncedCart = await syncCart(localCart);
          console.log('Cart synced successfully:', syncedCart);
          localStorage.removeItem(localCartKey);
        }
      }

      if (loggedInUser?.role === 'admin') {
        toast.success('Welcome Admin Redirecting to dashboard...');
        router.push('/admin/dashboard');
      } else {
        toast.success('Login successful! Welcome back 🛍️');
        router.push('/products');
      }

    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Invalid email or password';
      console.error('Login error:', msg, err);
      setError(msg);
      toast.error(msg);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f0f0f0] px-4 py-10 md:px-6 md:py-20">
      <div className="w-full max-w-lg space-y-12">

        {/* BRAND HEADER */}
        <div className="flex flex-col items-center text-center space-y-6">
          <Link href="/" className="group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-700 cursor-pointer scale-150"></div>
              <BrandLogo
                size={64}
                className="relative transition-all duration-700 transform group-hover:rotate-360 group-hover:scale-110"
              />
            </div>
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-none tracking-tight">Access the <span className="italic font-light text-gray-400">Archive.</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Studio Identification Required</p>
          </div>
        </div>

        {/* AUTH CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-14 border border-gray-100 shadow-2xl rounded-sm space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4">
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{error}</p>
            </div>
          )}

          <div className="space-y-10">
            {/* Email Field */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-dark uppercase tracking-[0.2em] block">
                Email Archive <span className="text-amber-500 ml-1 font-normal">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border-2 border-gray-100 focus:border-dark px-6 py-5 text-xs font-bold text-dark outline-none transition-all duration-300 placeholder:text-gray-300 tracking-widest rounded-sm focus:shadow-lg cursor-pointer focus:cursor-text"
                placeholder="ENTER YOUR EMAIL..."
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3 relative">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-dark uppercase tracking-[0.2em] block">
                  Security Key <span className="text-amber-500 ml-1 font-normal">*</span>
                </label>
                <span className="text-[9px] font-bold text-gray-400 hover:text-dark uppercase tracking-widest transition-colors cursor-pointer">Forgot?</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border-2 border-gray-100 focus:border-dark px-6 py-5 text-xs font-bold text-dark outline-none transition-all duration-300 placeholder:text-gray-300 tracking-widest rounded-sm focus:shadow-lg cursor-pointer focus:cursor-text pr-12"
                  placeholder="ENTER SECURITY KEY..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dark transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white px-8 py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-800 transition-all active:scale-[0.98] duration-500 shadow-xl shadow-dark/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Enter the Collection'}
            </button>

            <div className="text-center space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                New to the Studio?{' '}
                <Link
                  href="/register"
                  className="text-dark hover:text-amber-500 transition-colors font-bold underline underline-offset-4 decoration-1 decoration-gray-200 hover:decoration-amber-500"
                >
                  Create an Identity
                </Link>
              </p>
              <p className="text-[9px] text-gray-300 uppercase tracking-[0.2em]">Verified Secure Access</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
