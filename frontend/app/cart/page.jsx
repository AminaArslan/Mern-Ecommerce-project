'use client';

import { useCart } from '@/context/cartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [updatingId, setUpdatingId] = useState(null);

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    setUpdatingId(id);
    await updateQuantity(id, qty);
    setUpdatingId(null);
  };

  if (cart.length === 0)
    return (
      <div className="text-center mt-12">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <Link
          href="/products"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image?.url || '/placeholder.png'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>${item.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <label>Qty:</label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                className="border p-1 w-20 rounded"
                disabled={updatingId === item._id}
              />
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="flex flex-col md:flex-row justify-end items-center space-y-2 md:space-y-0 md:space-x-4 mt-6">
        <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
        <Link
          href="/checkout"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
