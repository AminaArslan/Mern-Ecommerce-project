'use client';

import { useCart } from '@/context/cartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiX, FiTrash } from 'react-icons/fi';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [updatingId, setUpdatingId] = useState(null);

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    setUpdatingId(id);
    try {
      await updateQuantity(id, qty); // update cart context & backend
    } catch (err) {
      console.error("Error updating quantity for item:", id, err);
    } finally {
      setUpdatingId(null);
    }
  };



  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-11/12 sm:w-96 bg-primary text-dark shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-deep">
          <h2 className="font-bold text-lg">My Cart ({cart.length})</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-accent transition cursor-pointer"
          >
            <FiX />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center opacity-70">
              <p>Your cart is empty</p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-3 inline-block btn-primary"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (cart.map((item) => {
            console.log("🛒 Cart Item:", item); // see structure in console

            const imageSrc =
              item.image ||
              item.images?.[0]?.url ||
              "/placeholder.png";


            // ======= DEBUG: Check item =======
            if (!item) console.warn("Cart item is undefined:", item);
            if (!item._id) console.warn("Cart item missing _id:", item);

            // Use correct image
            // const imageSrc = item.image?.url || "/placeholder.png";

            return (
              <div
                key={item._id}
                className="flex items-center justify-between bg-secondary rounded p-3 shadow-sm"
              >
                <img
                  src={imageSrc}
                  alt={item.name || "Product"}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1 ml-3">
                  <div className="w-40"> {/* Set a fixed width for truncation */}
                    <h3 className="truncate capitalize">{item.name || "Unknown"}</h3>
                  </div>

                  {/* Price × Quantity */}
                  <p className="text-sm opacity-70">
                    Rs. {(item.price * item.quantity || 0).toLocaleString("en-IN")}
                  </p>

                  {/* Quantity Input */}
                  <div className='flex justify-between'>
                    <div className="flex items-center space-x-2 mt-1">

                      {/* Decrement button */}
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingId === item._id}
                        className="px-2 py-1 bg-deep text-light rounded hover:bg-accent transition"
                      >
                        -
                      </button>

                      {/* Quantity display */}
                      <span className="px-3 py-1 border rounded w-10 text-center">
                        {item.quantity}
                      </span>

                      {/* Increment button */}
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={updatingId === item._id}
                        className="px-2 py-1 bg-deep text-light rounded hover:bg-accent transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-sm bg-deep text-light px-2 py-1 rounded hover:bg-accent transition cursor-pointer flex items-center justify-center"
                    >
                      <FiTrash className="w-4 h-4" />
                    </button>

                  </div>
                </div>


              </div>
            );
          })
          )}
        </div>

        {/* Footer / Total */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-deep flex flex-col space-y-2">
            <p className="text-lg font-bold">Total: Rs.{Number(totalPrice.toFixed(2)).toLocaleString("en-IN")}</p>


            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-primary text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
