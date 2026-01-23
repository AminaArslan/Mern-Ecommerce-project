'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ---------------- Validation Helpers ----------------
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ---------------- Frontend Validation ----------------
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character'
      );
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });

      router.push('/products'); // always customer, no role needed
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Registration failed'
      );
      console.error('Registration error:', err);
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
        <h1 className="text-3xl font-bold text-dark text-center">Register</h1>

        {error && (
          <p className="text-red-600 font-medium text-center">{error}</p>
        )}

        <div className="space-y-1">
          <label className="font-medium text-dark">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-dark/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Your full name"
          />
        </div>

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
          className={`w-full p-3 rounded-lg font-semibold text-light ${
            loading
              ? 'bg-dark/50 cursor-not-allowed'
              : 'bg-accent hover:bg-dark transition hover:scale-105'
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-dark text-sm">
          Already have an account?{' '}
          <span
            className="text-accent font-medium cursor-pointer hover:underline"
            onClick={() => router.push('/login')}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
