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
import AdminNavbar from './adminnavbar';
// import AdminNavbar from '@/componenets/admin/AdminNavbar'; // <-- import your navbar

export default function AdminLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-accent text-light p-2 rounded shadow-md hover:bg-dark transition hover:scale-105"
        onClick={() => setOpen(true)}
      >
        <GiHamburgerMenu size={22} />
      </button>

      {/* Sidebar overlay mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-secondary text-light p-4 space-y-6 z-50 
          shadow-xl transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Close button mobile */}
        <button
          className="md:hidden text-light absolute top-4 right-4 hover:text-deep transition"
          onClick={() => setOpen(false)}
        >
          <IoClose size={22} />
        </button>
        <h2 className="text-2xl font-bold mt-2 tracking-wide text-dark">
          Admin Panel
        </h2>

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
          onClick={() => logout()}
          className="mt-6 w-full px-4 py-2 bg-accent text-light rounded hover:bg-dark transition hover:scale-105 cursor-pointer"
        >
          Logout
        </button>
      </aside>

      {/* Main content with Admin Navbar */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <AdminNavbar /> {/* <-- Your Admin Navbar */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
