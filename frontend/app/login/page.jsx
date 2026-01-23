'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ already logged-in user redirect
  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin/dashboard');
    } else if (user) {
      router.replace('/products');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login({ email, password });

      if (loggedInUser?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/products');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Invalid email or password'
      );
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
          <p className="text-deep font-medium text-center">
            {error}
          </p>
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
                     hover:bg-dark hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
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
