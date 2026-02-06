'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  FiChevronRight, FiChevronDown, FiPlus, FiMinus, FiHome, FiGrid, FiShoppingBag,
  FiInfo, FiPhone, FiHelpCircle, FiX, FiUser, FiLogIn, FiLogOut, FiArrowUpRight
} from 'react-icons/fi';
import { useAuth } from '@/context/authContext';
import BrandLogo from './BrandLogo';

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const [openInformation, setOpenInformation] = useState(false);

  return (
    <>
      {/* 🌑 GLASSMORPHISM OVERLAY */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-500"
        />
      )}

      {/* 🪐 LUXURY SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-80 bg-dark text-white flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-[70]
          transform transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden border-r border-white/5 animate-in slide-in-from-left duration-700`}
      >
        {/* HEADER: PROMINENT BRANDING */}
        <div className="flex items-center justify-between gap-3 px-8 py-10 border-b border-white/5 bg-white/[0.02]">
          <Link href="/" onClick={onClose} className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-500 cursor-pointer scale-150"></div>
              <BrandLogo
                size={44}
                className="relative transition-all duration-500 transform group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col cursor-pointer">
              <h2 className="text-xl font-serif font-bold tracking-tighter text-white leading-none">
                STUDIO <span className="italic font-light opacity-60">AMINA</span>
              </h2>
              <p className="text-[9px] uppercase tracking-[0.4em] text-amber-500/80 font-bold mt-1">
                Boutique
              </p>
            </div>
          </Link>
          <button onClick={onClose} className="text-2xl cursor-pointer hover:rotate-90 transition-transform duration-500 text-gray-500 hover:text-white">
            <FiX />
          </button>
        </div>

        {/* MAIN NAVIGATION: SYNCHRONIZED WITH NAVBAR */}
        <nav className="flex-1 px-6 py-10 space-y-3 overflow-y-auto custom-scrollbar">

          <SidebarLink href="/" icon={FiHome} label="Home" onClick={onClose} />
          <SidebarLink href="/category" icon={FiGrid} label="Collection" onClick={onClose} />
          <SidebarLink href="/products" icon={FiShoppingBag} label="Shop" onClick={onClose} />

          {/* INFORMATION ACCORDION (PAGES) */}
          <div className="space-y-2">
            <button
              onClick={() => setOpenInformation(!openInformation)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-sm hover:bg-white/5 transition-all cursor-pointer group"
            >
              <span className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">
                <FiInfo className="text-amber-500/60" /> Information
              </span>
              {openInformation ? <FiMinus size={14} /> : <FiPlus size={14} />}
            </button>

            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${openInformation ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
              <div className="ml-12 flex flex-col border-l border-white/5 space-y-1">
                <SidebarSubLink href="/pages/about-us" label="About Us" onClick={onClose} />
                <SidebarSubLink href="/pages/contact-us" label="Contact Us" onClick={onClose} />
                <SidebarSubLink href="/pages/faq" label="FAQ" onClick={onClose} />
              </div>
            </div>
          </div>

          {user && (
            <SidebarLink href="/orders" icon={FiShoppingBag} label="My Orders" onClick={onClose} />
          )}
        </nav>

        {/* USER ARCHIVE SECTION */}
        <div className="px-6 py-8 border-t border-white/5 bg-white/[0.01]">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 px-5 opacity-90">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <FiUser className="text-amber-500" size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold leading-none mb-1">Authenticated as</span>
                  <span className="text-xs font-bold text-white truncate max-w-[160px]">{user.email || 'Archive User'}</span>
                </div>
              </div>
              <button
                onClick={() => { logout(); onClose(); }}
                className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-sm bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-left cursor-pointer group"
              >
                <FiLogOut className="group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Exit the Archive</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-3 px-8 py-5 rounded-sm bg-white text-dark hover:bg-amber-400 transition-all duration-500 cursor-pointer shadow-2xl"
            >
              <FiLogIn size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Access Boutique</span>
            </Link>
          )}

          <div className="mt-8 text-center">
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] italic">© 2026 Studio Amina.</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ href, icon: Icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-5 py-5 rounded-sm hover:bg-white/5 transition-all cursor-pointer group border-b border-transparent hover:border-amber-400/20"
    >
      <span className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-300 group-hover:text-white group-hover:tracking-[0.3em] transition-all duration-500">
        <Icon className="text-amber-400/40 group-hover:text-amber-400 transition-colors" size={18} />
        {label}
      </span>
      <FiChevronRight size={14} className="text-gray-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

function SidebarSubLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-amber-400 transition-all cursor-pointer group"
    >
      <span>{label}</span>
      <FiArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
