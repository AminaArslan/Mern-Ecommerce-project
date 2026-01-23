'use client';

import { useCart } from '@/context/cartContext';
import Link from 'next/link';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [updatingId, setUpdatingId] = useState(null);

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    setUpdatingId(id);
    await updateQuantity(id, qty); // update cart context & backend
    setUpdatingId(null);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-primary text-dark shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
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
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-secondary rounded p-3 shadow-sm"
              >
                <img
                  src={product.images[0].url}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 ml-3">
                  <h3 className="truncate capitalize">{item.name}</h3>

                  {/* Price × Quantity */}
                  <p className="text-sm opacity-70">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Quantity Input */}
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item._id, Number(e.target.value))
                    }
                    className="border p-1 w-20 rounded mt-1"
                    disabled={updatingId === item._id}
                  />
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-sm bg-deep text-light px-2 py-1 rounded hover:bg-accent transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Total */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-deep flex flex-col space-y-2">
            <p className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</p>
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
