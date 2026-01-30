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

  // ---------------- Guest ID Helper ----------------
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
      // Load local cart
      let localCart = JSON.parse(localStorage.getItem("localCart") || "[]");

      // Load backend cart for logged-in user
      let backendItems = [];
      if (user) {
        const backend = await fetchCart();
        backendItems = backend?.items?.map(b => ({
          _id: b.product._id,
          name: b.product.name,
          price: b.product.price,
          images: Array.isArray(b.product.images)
            ? b.product.images
            : b.product.image
            ? [{ url: b.product.image }]
            : [{ url: "/placeholder.png" }],
          quantity: b.quantity,
        })) || [];
      }

      // Merge local + backend
      const merged = [...localCart];
      backendItems.forEach(b => {
        const exists = merged.find(i => i._id === b._id);
        if (exists) exists.quantity = Math.max(exists.quantity, b.quantity);
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

  const saveAndSync = async () => {
    try {
      // Save local copy
      localStorage.setItem(
        user ? `cart_${user._id}` : "localCart",
        JSON.stringify(cart)
      );

      // Normalize cart for backend
      const normalizedCart = cart.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        images: item.images || [], // ⚡ keep full images array
        image: typeof item.image === "string"
          ? item.image
          : item.images?.[0]?.url || "/placeholder.png",
      }));

      if (user) {
        console.log("Syncing cart to backend:", normalizedCart);
        await syncCart(normalizedCart);
      }
    } catch (err) {
      console.error("Cart save/sync error:", err);
    }
  };

  saveAndSync();
}, [cart, user]);


  // ---------------- Cart Actions ----------------
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
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
