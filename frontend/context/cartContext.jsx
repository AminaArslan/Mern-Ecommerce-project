"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  fetchCart,
  syncCart,
  updateCartItem,
  removeCartItem,
  clearCartApi,
} from "@/lib/axios";
import { useAuth } from "./authContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Helper to get or generate guestId
  const getGuestId = () => {
    if (typeof window === "undefined") return null;
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  // ------------------ Load Cart ------------------
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR-safe

    const loadCart = async () => {
      try {
        const guestId = getGuestId();

        // Fetch backend cart (guest or logged-in)
        const backend = await fetchCart();
        const backendItems = backend?.items || [];

        // Load local cart (pre-login or guest)
        let localCart = [];
        const saved = localStorage.getItem("localCart");
        if (saved) localCart = JSON.parse(saved);

        // Merge backend + local cart
        const merged = [...localCart];
        backendItems.forEach(b => {
          const existing = merged.find(i => i._id === b.product._id);
          if (existing) {
            existing.quantity = Math.max(existing.quantity, b.quantity);
          } else {
            merged.push({
              _id: b.product._id,
              name: b.product.name,
              price: b.product.price,
              image: b.product.image?.url || b.product.image || "/placeholder.png",
              quantity: b.quantity,
            });
          }
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

  // ------------------ Sync Cart ------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const guestId = getGuestId();

    try {
      // Save to localStorage
      localStorage.setItem(user ? `cart_${user._id}` : "localCart", JSON.stringify(cart));

      // Sync to backend
      const syncServer = async () => {
        if (!Array.isArray(cart)) return;
        await syncCart(cart); // guestId handled inside fetchCart/syncCart
      };

      syncServer();
    } catch (err) {
      console.error("Error syncing cart:", err);
    }
  }, [cart, user]);

  // ------------------ Cart Actions ------------------
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        return prev.map(i =>
          i._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    openCart();
  };

  const removeFromCart = async (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
    await removeCartItem(id);
  };

  const updateQuantity = async (id, quantity) => {
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity } : i));
    await updateCartItem(id, quantity);
  };

  const clearCart = async () => {
    setCart([]);
    await clearCartApi();
  };

  // ------------------ Cart Totals ------------------
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
