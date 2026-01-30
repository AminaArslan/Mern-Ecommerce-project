'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login, user } = useAuth();
  const { syncCart } = useCart();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        router.push('/admin/dashboard');
      } else {
        router.push('/products');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Invalid email or password';
      console.error('Login error:', msg, err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-primary">
      <form
        onSubmit={handleSubmit}
        className="bg-light p-8 rounded-2xl shadow-xl w-96 space-y-6"
      >
        <h1 className="text-3xl font-bold text-dark text-center">
          Login
        </h1>

        {error && (
          <p className="text-deep font-medium text-center">{error}</p>
        )}

        <div className="space-y-1">
          <label className="font-medium text-dark">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-dark/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium text-dark">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-dark/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-light p-3 rounded-lg font-semibold transition
                     hover:bg-dark hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-dark text-sm">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-accent font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
