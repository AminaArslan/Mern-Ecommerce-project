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
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password, role });

      if (role === 'admin') router.push('/admin/dashboard');
      else router.push('/products');
    } catch (err) {
      setError(err.message || 'Registration failed');
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

        {error && <p className="text-deep font-medium text-center">{error}</p>}

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

        <div className="space-y-1">
          <label className="font-medium text-dark">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-dark/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg font-semibold text-light ${
            loading ? 'bg-dark/50 cursor-not-allowed' : 'bg-accent hover:bg-dark transition hover:scale-105'
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
