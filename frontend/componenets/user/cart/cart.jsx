'use client';
import { useCart } from '@/context/cartContext';
import Link from 'next/link';
import { useState } from 'react';
import { FiX, FiTrash, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [updatingId, setUpdatingId] = useState(null);

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    setUpdatingId(id);
    try {
      await updateQuantity(id, qty);
    } catch (err) {
      console.error("Error updating quantity:", id, err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      {/* OVERLAY - Deep Matte with Backdrop Blur */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-100 transition-opacity duration-700 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={onClose}
      />

      {/* DRAWER - High Fashion Aesthetic */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 bg-white shadow-2xl z-101 transform transition-transform duration-700 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
      >
        {/* HEADER - Editorial Style */}
        <div className="flex items-center justify-between px-10 pt-12 pb-10">
          <div>
            <h2 className="text-3xl font-serif text-dark leading-none tracking-tight">Your <span className="italic font-light text-gray-300">Curation.</span></h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-2">
              {cart.length} Pieces Selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-dark text-white rounded-full hover:bg-gray-800 transition-all cursor-pointer shadow-lg active:scale-90 group"
          >
            <FiX size={20} className="transition-transform group-hover:rotate-90 duration-500" />
          </button>
        </div>

        {/* ITEMS LIST */}
        <div className="flex-1 overflow-y-auto px-10 py-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
              <div className="space-y-4">
                <FiShoppingBag size={40} className="mx-auto text-gray-100" />
                <h3 className="text-2xl font-serif text-dark italic font-light">Your curation is empty.</h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest max-w-50 mx-auto leading-relaxed">Discover our latest artifacts and select your favorites.</p>
              </div>
              <Link
                href="/products"
                onClick={onClose}
                className="group flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] bg-dark text-white px-10 py-5 hover:bg-gray-800 transition-all active:scale-95 duration-500"
              >
                Explore Collection <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
            </div>
          ) : (
            <div className="space-y-12 pb-10">
              {cart.map((item) => {
                const imageSrc = item.images?.[0]?.url || item.image || "https://placehold.co/600x800/f3f4f6/374151?text=ARCHIVE";

                return (
                  <div
                    key={item._id}
                    className="group relative flex gap-6 animate-in slide-in-from-right-4 duration-500"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-32 bg-gray-50 shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-110"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-xs font-bold text-dark uppercase tracking-widest leading-relaxed flex-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-300 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <FiTrash size={14} />
                          </button>
                        </div>
                        <p className="text-[11px] font-serif text-dark italic">
                          Rs. {Number(item.price).toLocaleString()}
                        </p>
                      </div>

                      {/* QTY & TOTAL */}
                      <div className="flex items-end justify-between border-b border-gray-50 pb-2">
                        <div className="flex items-center border border-gray-100 rounded-full px-2 py-1 gap-4">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingId === item._id}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-dark disabled:opacity-20 transition-colors cursor-pointer"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="text-[10px] font-bold text-dark w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={updatingId === item._id || (item.stock && item.quantity >= item.stock)}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-dark transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-dark/70 uppercase tracking-widest">
                          Sub: Rs.{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER - Final Action */}
        {cart.length > 0 && (
          <div className="px-10 py-12 border-t border-gray-100 bg-white space-y-6">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ESTIMATED VALUE</p>
                <p className="text-xs font-bold text-dark uppercase tracking-widest italic">{cart.length} Pieces included</p>
              </div>
              <span className="text-3xl font-serif text-dark tracking-tighter">
                Rs.{Number(totalPrice.toFixed(2)).toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="group w-full flex items-center justify-between bg-dark text-white px-8 py-6 hover:bg-gray-800 transition-all active:scale-[0.98] duration-500 shadow-xl shadow-dark/5 cursor-pointer"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Finalize Curation</span>
              <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
            </Link>

            <p className="text-[9px] text-gray-300 text-center uppercase tracking-[0.2em]">Shipping & Taxes calculated at steps</p>
          </div>
        )}
      </aside>
    </>
  );
}
