"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/componenets/user/navbar/navbar";
import Footer from "@/componenets/user/footer";

export default function LayoutClientWrapper({ children }) {
  const pathname = usePathname();

  const showNavbar = !pathname.startsWith("/admin");
  const showFooter =
    !pathname.startsWith("/admin") &&
    pathname !== "/login" &&
    pathname !== "/register";

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1 bg-white">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
