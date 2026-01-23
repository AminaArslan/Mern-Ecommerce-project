"use client";

import "./globals.css";
import Navbar from "@/componenets/user/navbar/navbar";
import Footer from "@/componenets/user/footer";
import { AuthProvider } from "@/context/authContext";
import { CartProvider } from "@/context/cartContext";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { Roboto } from "next/font/google";

/* 🔤 Roboto Font */
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className={roboto.className}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              {/* Navbar */}
              {showNavbar && <Navbar />}

              {/* Main content */}
              <main className="flex-1 bg-white">
                {children}
              </main>

              {/* Footer */}
              {/* <Footer /> */}

              {/* Toast notifications */}
              <Toaster position="top-right" reverseOrder={false} />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
