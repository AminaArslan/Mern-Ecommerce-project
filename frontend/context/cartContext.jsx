'use client';

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { fetchCart, syncCart, updateCartItem, removeCartItem, clearCartApi } from "@/lib/axios";
import { useAuth } from "./authContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(false); // New flag to prevent premature syncing
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
        // Use consistent storage key for loading
        const storageKey = user ? `cart_${user._id}` : "localCart";
        let localCart = JSON.parse(localStorage.getItem(storageKey) || "[]");

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
            stock: b.product.quantity || 0, // Ensure stock is loaded
          })) || [];
        }

        // Merge local + backend
        const merged = [...localCart];
        backendItems.forEach(b => {
          const exists = merged.find(i => i._id === b._id);
          if (exists) {
            exists.quantity = Math.max(exists.quantity, b.quantity);
            exists.stock = b.stock; // Ensure stock is updated
          } else {
            merged.push(b);
          }
        });

        setCart(merged);
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setLoading(false);
        setIsInitialLoad(true); // Mark as loaded
      }
    };

    loadCart();
  }, [user]);

  // ---------------- Sync Cart ----------------
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialLoad) return; // Wait for initial load

    const saveAndSync = async () => {
      try {
        const storageKey = user ? `cart_${user._id}` : "localCart";

        // Save local copy
        localStorage.setItem(storageKey, JSON.stringify(cart));

        // Normalize cart for backend
        const normalizedCart = cart.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          images: item.images || [],
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
  }, [cart, user, isInitialLoad]);


  // ---------------- Cart Actions ----------------
  const addToCart = (product, selectedQuantity = 1) => {
    // 1. Determine available stock (favoring .stock for cart items, .quantity for API products)
    const availableStock = Number(product.stock !== undefined ? product.stock : product.quantity) || 0;

    // 2. Out of stock check
    if (availableStock === 0) {
      console.error('Cannot add out-of-stock item to cart');
      return { success: false, limit: 0 };
    }

    // 3. Check current quantity in cart using the 'cart' state (sync access here works because cart is from context)
    const existingItem = cart.find(i => i._id.toString() === product._id.toString());
    const currentCartQty = existingItem ? existingItem.quantity : 0;
    const newTotalQty = currentCartQty + selectedQuantity;

    // 4. Stock limit check
    if (newTotalQty > availableStock) {
      console.warn(`Cannot add more. Current: ${currentCartQty}, Adding: ${selectedQuantity}, Stock: ${availableStock}`);
      return { success: false, limit: availableStock };
    }

    // 5. Update state
    setCart(prev => {
      const exists = prev.find(i => i._id.toString() === product._id.toString());
      if (exists) {
        return prev.map(i => i._id.toString() === product._id.toString()
          ? { ...i, quantity: newTotalQty, stock: availableStock }
          : i
        );
      }
      return [...prev, {
        ...product,
        quantity: selectedQuantity,
        stock: availableStock
      }];
    });

    openCart();
    return { success: true };
  };

  const removeFromCart = async (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
    if (user) await removeCartItem(id);
  };

  const updateQuantity = async (id, quantity) => {
    setCart(prev => prev.map(i => {
      if (i._id.toString() === id.toString()) {
        const stock = i.stock || 999; // Use stored stock or large number as fallback
        const validQuantity = Math.max(1, Math.min(quantity, stock)); // Ensure range [1, stock]
        return { ...i, quantity: validQuantity };
      }
      return i;
    }));
    if (user) await updateCartItem(id, quantity);
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      try {
        await clearCartApi();
      } catch (err) {
        console.error('Failed to clear cart on backend:', err);
      }
    }
    return [];
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
