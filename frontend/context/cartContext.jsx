'use client';

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { fetchCart, syncCart, updateCartItem, removeCartItem, clearCartApi } from "@/lib/axios";
import { useAuth } from "./authContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // ---------------- Helper: guestId ----------------
  const getGuestId = () => {
    if (typeof window === "undefined") return null;
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  // ---------------- Load Cart ----------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadCart = async () => {
      try {
        let localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        let backendItems = [];

        if (user) {
          // Fetch backend cart for logged-in user
          const backend = await fetchCart();
          backendItems = backend?.items?.map(b => ({
            _id: b.product._id,
            name: b.product.name,
            price: b.product.price,
            image: b.product.image?.url || b.product.image || "/placeholder.png",
            quantity: b.quantity,
          })) || [];
        }

        // Merge localCart + backendItems
        const merged = [...localCart];
        backendItems.forEach(b => {
          const existing = merged.find(i => i._id === b._id);
          if (existing) existing.quantity = Math.max(existing.quantity, b.quantity);
          else merged.push(b);
        });

        setCart(merged);
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // ---------------- Sync Cart ----------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Save local copy
      localStorage.setItem(user ? `cart_${user._id}` : "localCart", JSON.stringify(cart));

      // Sync with backend only if logged-in
      if (user && cart.length > 0) {
        syncCart(cart); // backend handles merging
      }
    } catch (err) {
      console.error("Error syncing cart:", err);
    }
  }, [cart, user]);

  // ---------------- Cart Actions ----------------
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        return prev.map(i =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    openCart();
  };

  const removeFromCart = async (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
    if (user) await removeCartItem(id);
  };

  const updateQuantity = async (id, quantity) => {
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity } : i));
    if (user) await updateCartItem(id, quantity);
  };

  const clearCart = async () => {
    setCart([]);
    if (user) await clearCartApi();
  };

  // ---------------- Cart Totals ----------------
  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return { totalItems, totalPrice };
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading: loading || authLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        openCart,
        closeCart,
        isCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
