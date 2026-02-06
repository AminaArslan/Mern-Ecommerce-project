'use client';

import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdDashboard, MdInventory } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaUsers, FaShoppingCart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import AdminNavbar from './adminnavbar';

export default function AdminLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="w-full flex justify-center items-center h-screen text-lg text-dark bg-[#f0f0f0]">
        <p className="text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Loading Admin Panel...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <MdDashboard size={20} /> },
    { name: 'All Products', href: '/admin/products', icon: <MdInventory size={20} /> },
    { name: 'Add Product', href: '/admin/products/Addnewproduct', icon: <AiOutlinePlusCircle size={20} /> },
    { name: 'Categories', href: '/admin/categories', icon: <BiCategory size={20} /> },
    { name: 'Users', href: '/admin/customers', icon: <FaUsers size={20} /> },
    { name: 'Orders', href: '/admin/orders', icon: <FaShoppingCart size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#f9f9f9] font-sans">

      {/* Sidebar overlay mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#111111] text-gray-400 lg:z-50 z-50
          shadow-2xl transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-gray-800`}
      >
        <div className="flex flex-col h-full">
          {/* Header / Logo */}
          <div className='p-8 flex items-center justify-between'>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              Studio <span className="italic font-light text-amber-500">Admin</span>
            </h2>
            <button
              className="md:hidden text-gray-400 hover:text-white transition cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <IoClose size={22} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-md transition-all duration-200 group ${isActive
                    ? 'bg-amber-500/10 text-amber-500 border-l-2 border-amber-500'
                    : 'hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                    }`}
                  onClick={() => setOpen(false)}
                >
                  <span className={`transition-colors duration-200 ${isActive ? 'text-amber-500' : 'group-hover:text-white'}`}>{item.icon}</span>
                  <span className="text-sm font-medium tracking-wide uppercase text-[11px]">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Footer */}
          <div className="p-6 border-t border-gray-800">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center px-4 py-3 bg-white/5 text-gray-300 rounded hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content with Admin Navbar */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen transition-all duration-300 min-w-0">
        <AdminNavbar onSidebarToggle={() => setOpen(!open)} />
        <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] px-4">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-sm p-8 animate-in fade-in zoom-in duration-200 border border-gray-100">
            <h2 className="text-xl font-serif font-bold text-dark mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to exit the admin panel?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition rounded-sm cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-6 py-2.5 bg-dark text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition shadow-lg shadow-dark/20 disabled:opacity-50 cursor-pointer rounded-sm"
              >
                {loggingOut ? 'Exiting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
