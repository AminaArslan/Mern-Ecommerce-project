'use client';
// import "./admin.css"
import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdDashboard, MdInventory } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaUsers, FaShoppingCart } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import AdminNavbar from './adminnavbar';


export default function AdminLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
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
      <div className="w-full flex justify-center items-center h-screen text-lg text-dark">
        Loading Admin...
      </div>
    );
  }
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

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <MdDashboard size={20} /> },
    { name: 'All Products', href: '/admin/products', icon: <MdInventory size={20} /> },
    { name: 'Add Product', href: '/admin/products/Addnewproduct', icon: <AiOutlinePlusCircle size={20} /> },
    { name: 'Categories', href: '/admin/categories', icon: <BiCategory size={20} /> },
    { name: 'Users', href: '/admin/customers', icon: <FaUsers size={20} /> },
    { name: 'Orders', href: '/admin/orders', icon: <FaShoppingCart size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-primary">


      {/* Sidebar overlay mobile */}
      <div
        className={`fixed inset-0 bg-black/60 bg-opacity-40 z-40 lg:hidden transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
     <aside
  className={`fixed top-0 left-0 h-full w-64 bg-secondary text-light p-4 space-y-6 lg:z-50 z-100
    shadow-xl transform transition-transform duration-300
    ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
>
        {/* Close button mobile */}
        <div className='flex items-center justify-between'>
          <h2 className="text-2xl font-bold mt-2 tracking-wide text-dark">
          Admin Panel
        </h2>
        <button
          className="md:hidden text-light hover:text-deep transition cursor-pointer"
          onClick={() => setOpen(false)}
        >
          <IoClose size={22} />
        </button>
        
</div>
        <nav className="space-y-2 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-dark hover:scale-105 transition-all active:scale-95"
              onClick={() => setOpen(false)}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Logout */}
        <button
            onClick={() => {
    setShowLogoutModal(true);
  }}
          className="mt-6 w-full px-4 py-2 bg-accent text-light rounded hover:bg-dark transition hover:scale-105 cursor-pointer"
        >
          Logout
        </button>
      </aside>

      {/* Main content with Admin Navbar */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <AdminNavbar onSidebarToggle={() => setOpen(!open)} /> 
        <main className="flex-1 sm:p-6">
          {children}
        </main>
      </div>
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
    </div>
  );
}
