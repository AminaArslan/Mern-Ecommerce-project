'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { getMyOrders, cancelOrder } from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusConfig = {
    pending: { color: 'text-amber-500', bg: 'bg-amber-50', icon: FiClock, label: 'Awaiting' },
    paid: { color: 'text-blue-500', bg: 'bg-blue-50', icon: FiCheckCircle, label: 'Confirmed' },
    shipped: { color: 'text-fuchsia-500', bg: 'bg-fuchsia-50', icon: FiTruck, label: 'In Transit' },
    delivered: { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: FiCheckCircle, label: 'Delivered' },
    canceled: { color: 'text-rose-400', bg: 'bg-rose-50', icon: FiXCircle, label: 'Canceled' },
    cancelled: { color: 'text-rose-400', bg: 'bg-rose-50', icon: FiXCircle, label: 'Canceled' },
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast.error('Failed to load archive');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Cancel this curation?')) return;

    try {
      const updatedOrder = await cancelOrder(orderId);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: updatedOrder.orderStatus, paymentStatus: updatedOrder.paymentStatus }
            : order
        )
      );

      toast.success('Archive updated');
    } catch (err) {
      console.error('Error canceling order:', err);
      toast.error(err.message || 'Action failed');
    }
  };

  if (loading)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 pt-20">
        <div className="w-12 h-12 border-t-2 border-dark rounded-full animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Opening Archive...</p>
      </div>
    );

  if (!orders.length)
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-3 md:px-6 pt-20 space-y-8">
        <div className="space-y-4">
          <FiPackage size={48} className="mx-auto text-gray-100" />
          <h1 className="text-4xl md:text-5xl font-serif text-dark leading-none">Your archive is <span className="italic font-light text-gray-300">empty.</span></h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest max-w-xs mx-auto">Discover our latest curated pieces and start your collection today.</p>
        </div>
        <Link href="/products" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] bg-dark text-white px-10 py-5 hover:bg-gray-800 transition-all active:scale-95 duration-300">
          Explore Collection <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );

  return (
    <div className="w-full bg-[#f0f0f0] pt-32 pb-32 min-h-screen">
      <div className="container mx-auto px-3 md:px-6 max-w-5xl">

        {/* EDITORIAL HEADER */}
        <div className="text-center mb-24 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">
            Purchase History
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-dark leading-none tracking-tighter">
            Your <span className="italic font-light text-gray-300">Archive.</span>
          </h1>
          <p className="text-[11px] text-gray-400 font-medium tracking-[0.2em] uppercase pt-4">
            Total {orders.length} Curated Receipts
          </p>
        </div>

        <div className="space-y-16">
          {orders.map((order) => {
            const status = statusConfig[order.orderStatus || 'pending'] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={order._id}
                className="group relative bg-white border border-gray-100 p-4 md:p-8 lg:p-12 hover:border-dark shadow-sm hover:shadow-xl transition-all duration-700 rounded-sm"
              >
                {/* Status Float */}
                <div className={`absolute top-0 right-12 -translate-y-1/2 px-4 py-1.5 ${status.bg} flex items-center gap-2 rounded-full border border-current/10 shadow-sm z-10`}>
                  <StatusIcon size={12} className={status.color} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-12">

                  {/* Left: General Info */}
                  <div className="md:w-1/3 space-y-8">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">REFERENCE</p>
                      <h3 className="text-sm font-bold text-dark uppercase tracking-tighter">ORD-{order._id.slice(-8).toUpperCase()}</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-1 gap-8">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">METHOD</p>
                        <p className="text-[10px] font-bold text-dark uppercase tracking-widest">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">DATE</p>
                        <p className="text-[10px] font-bold text-dark uppercase tracking-widest">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {order.orderStatus === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="text-[9px] font-bold uppercase tracking-[0.2em] text-rose-500 border-b border-rose-500/20 pb-1 hover:text-rose-700 hover:border-current transition-all cursor-pointer"
                      >
                        Cancel curation
                      </button>
                    )}
                  </div>

                  {/* Right: Items */}
                  <div className="flex-1 space-y-6">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">CURATED PIECES</p>
                    <div className="space-y-4">
                      {order.orderItems?.map((item, idx) => (
                        <div key={item._id || idx} className="flex items-center justify-between group/item">
                          <div className="flex items-center gap-6">
                            <div className="relative w-16 h-20 bg-white overflow-hidden rounded-sm border border-gray-100 shadow-sm">
                              <img
                                src={
                                  item.product?.images?.[0]?.url ||
                                  (typeof item.image === 'string' && item.image.trim() !== '' ? item.image : '/placeholder.png')
                                }
                                alt={item.name}
                                className="w-full h-full object-cover group-hover/item:scale-110 transition-all duration-700"
                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                              />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-dark uppercase tracking-widest">{item.name}</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-serif text-dark italic">
                            Rs.{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total Footer */}
                    <div className="pt-8 border-t border-gray-100 flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">FINAL VALUE</p>
                        <p className="text-xs font-bold text-dark uppercase tracking-widest italic">{order.orderItems?.length} items included</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-serif text-dark tracking-tighter">
                          Rs.{Number(order.totalPrice).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Link */}
        <div className="mt-32 text-center pb-12">
          <Link href="/products" className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] bg-dark text-white px-12 py-5 hover:bg-gray-800 transition-all active:scale-95 duration-500 shadow-lg hover:shadow-dark/20">
            Continue Exploring Collection <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>

      </div>
    </div>
  );
}
