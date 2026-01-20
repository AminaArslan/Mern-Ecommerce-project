import "./globals.css";
import Navbar from "@/componenets/navbar";
import Footer from "@/componenets/footer";
import { AuthProvider } from "@/context/authContext";
import { CartProvider } from "@/context/cartContext";
import { Toaster } from "react-hot-toast";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              {/* Navbar */}
              <Navbar />
              {/* Main content */}
              <main className="flex-1 bg-gray-50">
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
