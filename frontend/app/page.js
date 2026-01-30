'use client';
import { useState, useEffect } from "react";
import LatestProducts from "@/componenets/user/products/latestproduct";
import "./globals.css";
import CategoryBoxes from "@/componenets/user/categoryList";
import HeroPage from "@/componenets/user/hero";
import ExploreNewCollection from "@/componenets/user/products/newcollection";
import ProductCompare from "@/componenets/user/products/productcompare";
import Footer from "@/componenets/user/footer";
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
      <CategoryBoxes />
      <Footer />

      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ring-btn"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          ↑
        </button>
      )}
    </div>
  );
}
