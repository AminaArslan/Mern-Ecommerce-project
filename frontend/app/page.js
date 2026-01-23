'use client';
import LatestProducts from "@/componenets/user/products/latestproduct";
import "./globals.css";

// import HeroCarousel from '@/components/user/hero';
import CategoryBoxes from "@/componenets/user/categoryList";
import HeroPage from "@/componenets/user/hero";

export default function HomePage() {
  return (
    <div className="">
      {/* Hero Section */}
      <HeroPage/>

      {/* Featured Products Section */}
      <LatestProducts />

      {/* Categories Section */}
      <section>
        <CategoryBoxes categories={[]} />
      </section>
    </div>
  );
}
