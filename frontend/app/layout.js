import "./globals.css";
import { Libre_Caslon_Text, Roboto } from "next/font/google";
import { AuthProvider } from "@/context/authContext";
import { CartProvider } from "@/context/cartContext";
import { Toaster } from "react-hot-toast";
import LayoutClientWrapper from "@/componenets/user/layout-client-wrapper";

/* Roboto */
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

/* Caslon */
const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caslon",
});

export const metadata = {
  title: {
    default: "Online clothing Store | Buy clothes",
    template: "%s | clothing Store",
  },
  description:
    "Buy genuine clothes online with fast delivery and secure payments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${caslon.variable}`}>
        <AuthProvider>
          <CartProvider>
            <LayoutClientWrapper>
              {children}
            </LayoutClientWrapper>
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
