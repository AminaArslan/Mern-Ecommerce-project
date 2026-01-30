"use client";
import { useState } from "react";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaTiktok, FaPinterestP } from "react-icons/fa";
import { FiArrowUpRight, FiPlus, FiMinus } from "react-icons/fi";
import { MdLocalShipping, MdSupportAgent } from "react-icons/md";
import { RiSecurePaymentLine, RiExchangeFundsLine } from "react-icons/ri";

function MobileSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/20 py-4 lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left cursor-pointer"
      >
        <h4 className="font-semibold text-white">{title}</h4>
        {open ? <FiMinus /> : <FiPlus />}
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-60 mt-3" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <section className="relative text-white pt-16 bg-dark">
    <footer className=" container mx-auto pt-16 pb-8 px-4 "
      
    >
      {/* DESKTOP GRID */}
      <div className="hidden lg:grid grid-cols-5 gap-5 xl:gap-10 mb-12">

        {/* Brand */}
        <div className="flex flex-col justify-between">
          <Link href={"/"}>
          <div className="flex items-center gap-3 ">
            <img src="/logo2.jpg" alt="MyStore"
              onError={(e)=>e.target.src='/placeholder.png'}
              className="w-11 h-11 rounded-full object-cover shadow-md ring-2 ring-accent"
            />
            <div>
              <h1 className="font-bold text-lg">MyStore</h1>
              <p className="text-xs opacity-70">Online Shopping</p>
            </div>
          
          </div>
            </Link>
          <p className="text-sm text-gray-300 mb-4">
            Timeless fashion made for everyday elegance.
          </p>
          <div className="flex gap-4 text-lg">
            <FaInstagram className="cursor-pointer" />
            <FaFacebookF className="cursor-pointer" />
            <FaTiktok className="cursor-pointer" />
            <FaPinterestP className="cursor-pointer" />
          </div>
        </div>

        {/* Shop */}
        <FooterLinks title="Shop" links={["New Arrivals","Best Sellers","Dresses","Winter Collection","On Sale"]} />

        {/* About */}
        <FooterLinks title="About" links={["Our Story","Sustainability","Blog","Careers","Store Locator"]} />

        {/* Help */}
        <FooterLinks title="Customer Care" links={["Contact Us","Shipping Info","Returns","Size Guide","FAQs"]} />

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-4">Join Our Style Club</h4>
          <p className="text-sm text-gray-300 mb-3">Get exclusive drops & tips.</p>
          <div className="flex flex-col gap-3 ">
            <input type="email" placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-sm text-black rounded bg-white outline-none"
            />
<button
  className=" bg-accent flex items-center gap-2 justify-center px-4 py-2 rounded-full text-white transition hover:opacity-90 active:scale-95 cursor-pointer"
  
>
  Join Now<FiArrowUpRight className="text-white" />
</button>
          </div>
        </div>
      </div>

      {/* MOBILE ACCORDION */}
      <div className="lg:hidden">
                {/* Brand in mobile bottom */}
        <div className="py-6 flex items-center justify-between">
          <Link href={"/"}>
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo2.jpg" className="w-10 h-10 rounded-full" />
            <div>
              <h1 className="font-bold">MyStore</h1>
              <p className="text-xs opacity-70">Online Shopping</p>
            </div>
          </div>
        </Link>
          <div className="flex gap-4 text-lg">
            <FaInstagram className=" cursor-pointer" />
            <FaFacebookF  className="cursor-pointer"/>
            <FaTiktok  className="cursor-pointer"/>
            <FaPinterestP className="cursor-pointer" />
          </div>
        </div>
        <MobileSection title="SHOP" >
          <FooterMobileLinks links={["New Arrivals","Best Sellers","Dresses","Winter Collection","On Sale"]} />
        </MobileSection>

        <MobileSection title="ABOUT">
          <FooterMobileLinks links={["Our Story","Sustainability","Blog","Careers","Store Locator"]} />
        </MobileSection>

        <MobileSection title="CUSTOMER CARE">
          <FooterMobileLinks links={["Contact Us","Shipping Info","Returns","Size Guide","FAQs"]} />
        </MobileSection>

        {/* Brand in mobile bottom */}

      </div>

      {/* TRUST BAR */}
      <div className="border-y border-white/20 py-4 mb-6 flex flex-wrap justify-between gap-4 text-sm text-gray-300">
        <div className="flex items-center gap-2"><MdLocalShipping /> Free Shipping over $50</div>
        <div className="flex items-center gap-2"><RiExchangeFundsLine /> 7-Day Easy Returns</div>
        <div className="flex items-center gap-2"><RiSecurePaymentLine /> Secure Payments</div>
        <div className="flex items-center gap-2"><MdSupportAgent /> 24/7 Support</div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <p>© 2026 AminaArslan. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
        </div>
      </div>

      {/* Back To Top */}

    </footer>
    </section>
  );
}

/* Reusable Components */
function FooterLinks({ title, links }) {
  return (
    <div>
      <h4 className="font-semibold mb-4">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        {links.map((l, i) => <li key={i}><a href="#" className="hover:text-[var(--color-accent)]">{l}</a></li>)}
      </ul>
    </div>
  );
}

function FooterMobileLinks({ links }) {
  return (
    <ul className="space-y-2 text-sm text-gray-300">
      {links.map((l, i) => <li key={i}><a href="#" className="block py-1">{l}</a></li>)}
    </ul>
  );
}