'use client';
import { useState, useEffect } from "react";
import LatestProducts from "@/componenets/user/products/latestproduct";
import "./globals.css";
import HeroPage from "@/componenets/user/hero";
import ExploreNewCollection from "@/componenets/user/products/newcollection";
import ProductCompare from "@/componenets/user/products/productcompare";
import CollectionsSection from "@/componenets/user/FashionMegaMenu";

export default function HomePage() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button if scrolled down 300px
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroPage />

      {/* Featured Products Section */}
      <LatestProducts />
      <ExploreNewCollection />
      <ProductCompare />
      <CollectionsSection />
     
      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className=" bg-[#fbbf24] fixed bottom-4 right-4 md:bottom-8 md:right-8 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-[#111827] shadow-2xl ring-btn cursor-pointer z-50 transition-all duration-500 hover:scale-110 active:scale-95 border border-white/10"
        >
          <span className="text-xl md:text-2xl font-bold">↑</span>
        </button>
      )}
    </div>
  );
}
