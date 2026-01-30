'use client';
import LatestProducts from "@/componenets/user/products/latestproduct";
import "./globals.css";

// import HeroCarousel from '@/components/user/hero';
import CategoryBoxes from "@/componenets/user/categoryList";
import HeroPage from "@/componenets/user/hero";
import ExploreNewCollection from "@/componenets/user/products/newcollection";
import ProductCompare from "@/componenets/user/products/productcompare";
import Footer from "@/componenets/user/footer";
import CollectionsSection from "@/componenets/user/FashionMegaMenu";


export default function HomePage() {
  return (
    <div className="">
      {/* Hero Section */}
      <HeroPage/>

      {/* Featured Products Section */}
      <LatestProducts />
      <ExploreNewCollection/> 
      <ProductCompare/>
         <CollectionsSection/>
        <CategoryBoxes  />
        <Footer/>
    </div>
  );
}
