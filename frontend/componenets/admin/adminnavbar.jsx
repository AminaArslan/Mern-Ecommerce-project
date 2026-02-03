'use client';

import { useAuth } from '@/context/authContext';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import { IoIosNotificationsOutline } from "react-icons/io";
import toast from 'react-hot-toast';

export default function AdminNavbar({ onSidebarToggle }) {
  const { user, logout } = useAuth();
  const [avatarDropdown, setAvatarDropdown] = useState(false);
  const [bellDropdown, setBellDropdown] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Check saved theme
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

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      toast.success('Logged out successfully 👋');
    } catch (err) {
      toast.error('Logout failed');
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <header className="bg-secondary dark:bg-dark text-light shadow-md sticky top-0 lg:z-50">
      <div className="max-w-7xl mx-auto flex justify-between lg:justify-end items-center p-4 relative">
        {/* Left side: Sidebar Toggle */}
        <button
          onClick={onSidebarToggle}
          className=" lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-accent hover:bg-dark text-light shadow-md transition hover:scale-105 cursor-pointer"
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Right side: Icons */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg bg-accent text-light hover:bg-dark transition-shadow shadow-sm hover:shadow-md cursor-pointer"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setBellDropdown(!bellDropdown);
                setAvatarDropdown(false);
              }}
              className="text-2xl relative flex items-center justify-center p-2 rounded-full cursor-pointer transition bg-secondary hover:bg-accent text-light"
            >
              <IoIosNotificationsOutline />
              {pendingOrders > 0 && (
                <span className="badge -top-1 -right-1 animate-pulse">{pendingOrders}</span>
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
                  onClick={() => {
                    setAvatarDropdown(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[100]">
          <div className="bg-white dark:bg-deep rounded-xl shadow-2xl w-[90%] max-w-md p-6 animate-scaleIn">
            <h2 className="text-xl font-bold text-dark dark:text-light mb-3">
              Confirm Logout
            </h2>
            <p className=" text-dark mb-6">
              Are you sure you want to logout from the admin panel?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-4 py-2 rounded bg-accent text-white hover:bg-dark transition disabled:opacity-50 cursor-pointer"
              >
                {loggingOut ? 'Logging out...' : 'Yes, Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
