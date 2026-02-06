'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { FiShoppingBag, FiClock } from 'react-icons/fi';
import { FaCircle } from 'react-icons/fa';

export default function RecentOrdersCard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const { data } = await axios.get('/orders/admin/all');
        setOrders(data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecentOrders();
  }, []);

  return (
    <div className="bg-white rounded-sm shadow-xl border border-gray-100 p-6 w-full h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
        <h2 className="font-serif text-xl font-bold text-dark">
          Recent Orders
        </h2>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full">
          <FiClock /> <span>Latest 5</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 -mx-4 rounded-sm hover:bg-gray-50 transition-all duration-200 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center justify-between sm:justify-start gap-4 mb-3 sm:mb-0 w-full sm:w-auto">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-sm border border-amber-100 group-hover:scale-110 transition-transform shrink-0">
                  #{order._id.slice(-4)}
                </div>

                <div>
                  <p className="text-sm font-bold text-dark group-hover:text-amber-600 transition-colors line-clamp-1">
                    {order.orderItems?.[0]?.name || 'Product'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    {order.orderItems?.length || 1} Item(s) • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-0 sm:pl-0 w-full sm:w-auto mt-2 sm:mt-0">
              <span
                className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${order.orderStatus === 'delivered'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : order.orderStatus === 'pending'
                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                    : order.orderStatus === 'shipped'
                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}
              >
                <FaCircle className="text-[6px]" />
                {order.orderStatus}
              </span>

              <p className="font-serif font-bold text-dark text-sm min-w-20 text-right">
                Rs.{Number(order.totalPrice).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center text-gray-400 py-10 text-xs uppercase tracking-widest">
          No recent orders found
        </div>
      )}
    </div>
  );
}
