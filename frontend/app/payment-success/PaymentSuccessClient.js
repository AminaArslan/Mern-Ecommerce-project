'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/axios';
import { useCart } from '@/context/cartContext';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('No order ID found.');
      setLoading(false);
      return;
    }

    const fetchOrderAndClearCart = async () => {
      try {
        // Fetch order from backend
        const data = await getOrderById(orderId);
        setOrder(data);
        setLoading(false);

        // Clear cart safely
        await clearCart();
      } catch (err) {
        console.error('Error fetching order or clearing cart:', err);
        setError('Failed to fetch order or clear cart.');
        setLoading(false);
      }
    };

    fetchOrderAndClearCart();
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f0f0f0]">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">Verifying Transaction...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f0f0f0]">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-500">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f0f0f0]">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f0f0f0] px-4 py-10 md:px-6 md:py-20">
      <div className="w-full max-w-2xl bg-white p-8 md:p-14 border border-gray-100 shadow-2xl rounded-sm space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* SUCCESS HEADER */}
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-green-600 text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-dark leading-none tracking-tight">
            Order <span className="italic font-light text-green-600">Confirmed.</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 leading-relaxed">
            Thank you, {order.shippingAddress.firstName}. Your curation is secured.
          </p>
        </div>

        {/* ORDER DETAILS */}
        <div className="space-y-8 border-t border-b border-gray-50 py-8">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1">Order ID</p>
              <p className="text-xs font-mono font-bold text-dark">{order._id}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1">Total Amount</p>
              <p className="text-xl font-serif font-bold text-dark">Rs. {order.totalPrice.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-dark uppercase tracking-[0.2em] mb-4">Curation Summary</p>
            {order.orderItems.map((item) => (
              <div key={item.product} className="flex justify-between items-center text-sm border-b border-dashed border-gray-100 pb-2 last:border-0">
                <span className="font-medium text-gray-600">{item.name} <span className="text-xs text-gray-300">x{item.quantity}</span></span>
                <span className="font-bold text-dark">Rs. {item.price.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="space-y-4">
          <button
            onClick={() => router.push('/orders')}
            className="w-full group flex items-center justify-between bg-dark text-white px-8 py-5 hover:bg-gray-800 transition-all duration-300 shadow-xl shadow-dark/10 cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">View Order Status</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          <Link href="/products" className="block text-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-dark transition-colors cursor-pointer border-b border-transparent hover:border-dark pb-0.5">
              Return to Collection
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
}
