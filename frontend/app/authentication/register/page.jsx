'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import BrandLogo from '@/componenets/user/BrandLogo';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const msg = 'Please fill in all fields';
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!validateEmail(email)) {
      const msg = 'Invalid email format';
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!validatePassword(password)) {
      const msg =
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
      setError(msg);
      toast.error(msg);
      return;
    }


    setLoading(true);

    try {
      await register({ name, email, password });

      toast.success('Account created successfully! Welcome 🎉');
      router.push('/products');

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Registration failed';

      setError(msg);
      toast.error(msg);
      console.error('Registration error:', err);
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
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-none tracking-tight">Join the <span className="italic font-light text-gray-400">Archive.</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Create Your Studio Identity</p>
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
            {/* Name Field */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-dark uppercase tracking-[0.2em] block">
                Full Identity <span className="text-amber-500 ml-1 font-normal">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white border-2 border-gray-100 focus:border-dark px-6 py-5 text-xs font-bold text-dark outline-none transition-all duration-300 placeholder:text-gray-300 tracking-widest rounded-sm focus:shadow-lg cursor-pointer focus:cursor-text"
                placeholder="ENTER YOUR NAME..."
              />
            </div>

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
                placeholder="PROVISION YOUR EMAIL..."
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3 relative">
              <label className="text-[11px] font-bold text-dark uppercase tracking-[0.2em] block">
                Security Key <span className="text-amber-500 ml-1 font-normal">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border-2 border-gray-100 focus:border-dark px-6 py-5 text-xs font-bold text-dark outline-none transition-all duration-300 placeholder:text-gray-300 tracking-widest rounded-sm focus:shadow-lg cursor-pointer focus:cursor-text pr-12"
                  placeholder="SET SECURITY KEY..."
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
              {loading ? 'Registering...' : 'Join the Collection'}
            </button>

            <div className="text-center space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                Already have an identity?{' '}
                <span
                  className="text-dark hover:text-amber-500 transition-colors font-bold underline underline-offset-4 decoration-1 decoration-gray-200 hover:decoration-amber-500 cursor-pointer"
                  onClick={() => router.push('/login')}
                >
                  Access the Archive
                </span>
              </p>
              <p className="text-[9px] text-gray-300 uppercase tracking-[0.2em]">Verified Secure Registration</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
