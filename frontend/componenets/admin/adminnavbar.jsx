'use client';

import { useAuth } from '@/context/authContext';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { FiMenu, FiBell } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminNavbar({ onSidebarToggle }) {
  const { user, logout } = useAuth();
  const [avatarDropdown, setAvatarDropdown] = useState(false);
  const [bellDropdown, setBellDropdown] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);

  // Fetch pending orders
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const { data } = await axios.get('/orders/admin/pending/count');
        setPendingOrders(data.count || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <header className="bg-white border-b border-gray-100 lg:sticky lg:top-0 lg:z-40 h-20">
      <div className="h-full px-6 flex justify-between lg:justify-end items-center relative">
        {/* Left side: Sidebar Toggle (Mobile) */}
        <button
          onClick={onSidebarToggle}
          className="lg:hidden flex items-center justify-center p-2 text-dark hover:bg-gray-50 transition rounded-md cursor-pointer"
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Right side: Icons */}
        <div className="flex items-center space-x-6">

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setBellDropdown(!bellDropdown);
                setAvatarDropdown(false);
              }}
              className="relative p-2 text-gray-400 hover:text-dark transition-colors cursor-pointer"
            >
              <FiBell size={20} />
              {pendingOrders > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse border border-white"></span>
              )}
            </button>

            {bellDropdown && (
              <div className="absolute right-0 mt-4 w-72 bg-white rounded-sm shadow-2xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notifications</p>
                </div>
                <div className="p-2">
                  {pendingOrders > 0 ? (
                    <div className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer rounded-sm">
                      <p className="text-sm font-medium text-dark">New Orders Pending</p>
                      <p className="text-xs text-amber-600 mt-1">{pendingOrders} orders need processing</p>
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">
                      All caught up!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative pl-6 border-l border-gray-100">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                setAvatarDropdown(!avatarDropdown);
                setBellDropdown(false);
              }}
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-dark group-hover:text-amber-600 transition-colors uppercase tracking-wide">{user.name}</p>
                <p className="text-[10px] text-gray-400">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-dark font-serif font-bold text-lg group-hover:bg-amber-50 group-hover:border-amber-200 transition-all">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {avatarDropdown && (
              <div className="absolute right-0 mt-4 w-56 bg-white rounded-sm shadow-2xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-sm font-bold text-dark">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-xs font-bold text-rose-500 uppercase tracking-widest hover:bg-rose-50 transition rounded-sm cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
