"use client";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaTiktok, FaPinterestP } from "react-icons/fa";
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiMail } from "react-icons/fi";
import { MdSupportAgent } from "react-icons/md";
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="relative bg-[#111827] pt-12 pb-8 overflow-hidden border-t border-white/10">
      {/* 📰 EDITORIAL BACKGROUND ACCENT */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />

      <div className="container mx-auto px-3 md:px-6 max-w-7xl">

        {/* --- TOP ROW: NEWSLETTER & GRID --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start gap-12 mb-12">

          {/* THE INVITATION */}
          <div className="xl:w-1/3 space-y-4">
            <h2 className="text-2xl font-serif text-white leading-tight tracking-tight">
              Join the <span className="italic font-light text-gray-200 underline decoration-1 underline-offset-8">Archive.</span>
            </h2>
            <div className="relative group max-w-sm">
              <input
                type="email"
                placeholder="PROCEED WITH YOUR EMAIL..."
                className="w-full bg-transparent border-b border-white/20 focus:border-amber-400 py-3 text-[11px] font-bold text-white outline-none transition-all duration-700 placeholder:text-gray-600 uppercase tracking-[0.3em]"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-all cursor-pointer group-hover:translate-x-1 duration-500">
                <FiArrowRight size={18} />
              </button>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
              Curated minimal fashion insights.
            </p>
          </div>

          {/* EDITORIAL COLUMNS */}
          <div className="w-full xl:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8">
            <FooterCol title="Collection" links={[
              { label: "New Arrivals", href: "/category" },
              { label: "Boutique Shop", href: "/products" },
              { label: "The Archive", href: "/orders" }
            ]} />
            <FooterCol title="Information" links={[
              { label: "About Us", href: "/pages/about-us" },
              { label: "Our Story", href: "/pages/about-us" },
              { label: "Legal Archive", href: "/orders" }
            ]} />
            <FooterCol title="Customer Care" links={[
              { label: "Contact Us", href: "/pages/contact-us" },
              { label: "FAQ", href: "/pages/faq" },
              { label: "Shipping", href: "/" }
            ]} />
            <FooterCol title="Identity" links={[
              { label: "Portal", href: "/login" },
              { label: "Registry", href: "/register" },
              { label: "Security", href: "/" }
            ]} />
          </div>
        </div>

        {/* --- BOTTOM ROW: SIGNATURES --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-white/5">

          {/* Brand Identity */}
          <div className="flex items-center gap-4 group">
            <BrandLogo size={28} className="transition-all duration-700" />
            <h3 className="text-sm font-serif text-white tracking-widest uppercase">STUDIO <span className="italic font-light opacity-70">AMINA</span></h3>
          </div>

          {/* Trust Signatures */}
          <div className="flex flex-wrap justify-center gap-8 order-3 md:order-2">
            <TrustBadge Icon={FiTruck} text="Protocol" />
            <TrustBadge Icon={FiShield} text="Secure" />
            <TrustBadge Icon={FiRefreshCw} text="Exchange" />
          </div>

          {/* Socials & Credits */}
          <div className="flex flex-col items-center md:items-end gap-3 order-2 md:order-3">
            <div className="flex items-center gap-6">
              {[FaInstagram, FaFacebookF, FaTiktok, FaPinterestP].map((Icon, i) => (
                <Icon key={i} className="text-gray-500 hover:text-white transition-all cursor-pointer transform hover:scale-110" size={16} />
              ))}
            </div>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest italic">Crafted by Amina.</p>
          </div>

        </div>

        {/* --- FINAL BASE TAG --- */}
        <p className="mt-8 text-center text-[10px] font-bold text-white/80 uppercase tracking-[0.5em]">© 2026 Studio Amina Fashion Group.</p>

      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.4em] border-b border-white/5 pb-2 inline-block">{title}</h4>
      <ul className="space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <Link href={link.href} className="text-[11px] font-bold text-gray-400 hover:text-white transition-all cursor-pointer uppercase tracking-[0.2em] block hover:translate-x-1 duration-500">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrustBadge({ Icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="text-amber-500/60" size={12} />
      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{text}</span>
    </div>
  );
}
