"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { fetchCart, syncCart, updateCartItem, removeCartItem, clearCartApi } from "@/lib/axios";
import { useAuth } from "./authContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart for the logged-in user
  useEffect(() => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    if (typeof window === "undefined") return; // SSR-safe

    const loadCart = async () => {
      try {
        // Load local cart specific to user
        let localCart = [];
        const saved = localStorage.getItem(`cart_${user._id}`);
        if (saved) localCart = JSON.parse(saved);

        // Load backend cart
        const backend = await fetchCart();
        const backendItems = backend?.items || [];

        // Merge
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
              quantity: b.quantity
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

  // Sync cart whenever it changes
  useEffect(() => {
    if (!user || typeof window === "undefined") return;

    try {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cart));

      const syncServer = async () => {
        try {
          await syncCart(cart);
        } catch (err) {
          console.error("Error syncing cart:", err);
        }
      };
      syncServer();
    } catch (err) {
      console.error("Error saving cart:", err);
    }
  }, [cart, user]);

  // Cart actions
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
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

  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return { totalItems, totalPrice };
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, loading: loading || authLoading, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
