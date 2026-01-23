'use client';

import { useAuth } from '@/context/authContext';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { FiSun, FiMoon } from 'react-icons/fi';
import { IoIosNotificationsOutline } from "react-icons/io";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const [avatarDropdown, setAvatarDropdown] = useState(false);
  const [bellDropdown, setBellDropdown] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Check saved theme on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

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

  // Toggle theme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <header className="bg-secondary dark:bg-dark text-light shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-end items-center p-4 space-x-4 relative">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded-lg bg-accent text-light hover:bg-dark transition-shadow shadow-sm hover:shadow-md"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setBellDropdown(!bellDropdown);
              setAvatarDropdown(false);
            }}
            className="
      text-2xl relative flex items-center justify-center p-2
      rounded-full cursor-pointer transition
      bg-secondary  
      hover:bg-accent
      text-light
    "
          >
            <IoIosNotificationsOutline />

            {pendingOrders > 0 && (
              <span className="badge -top-1 -right-1 animate-pulse">
                {pendingOrders}
              </span>
            )}
          </button>


          {bellDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-light dark:bg-deep text-dark dark:text-light rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="px-4 py-2 font-semibold border-b border-gray-200 dark:border-gray-700">
                Pending Orders
              </div>
              <div className="px-4 py-3 text-sm">
                {pendingOrders > 0
                  ? `You have ${pendingOrders} pending order(s)`
                  : 'No pending orders at the moment.'}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-light font-bold text-lg cursor-pointer shadow-md hover:shadow-lg transition"
            onClick={() => {
              setAvatarDropdown(!avatarDropdown);
              setBellDropdown(false);
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          {avatarDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-light dark:bg-deep text-dark dark:text-light rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
