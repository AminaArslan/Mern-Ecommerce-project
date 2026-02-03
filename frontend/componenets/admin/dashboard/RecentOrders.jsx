
'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { FiShoppingBag } from 'react-icons/fi';
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
    <div className="bg-white dark:bg-dark rounded-2xl shadow-xl p-6 w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800 dark:text-light flex items-center gap-2">
          <FiShoppingBag className="text-accent" />
          Recent Orders
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Last 5 orders
        </span>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-xl hover:shadow-md hover:scale-[1.02] transition-all duration-300"
          >
            {/* Left Side */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
                #{order._id.slice(-4)}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-light">
                  {order.orderItems?.[0]?.name || 'Product'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {order.orderItems?.[0]?.quantity || 1} item(s)
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800 dark:text-light">
                Rs.{Number(order.totalPrice).toLocaleString('en-IN')}
              </p>

            <span
  className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
    order.orderStatus === 'delivered'
      ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
      : order.orderStatus === 'pending'
      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400'
      : order.orderStatus === 'shipped'
      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
      : order.orderStatus === 'cancelled' || order.orderStatus === 'canceled'
      ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
  }`}
>
  <FaCircle className="text-[8px]" />
  {order.orderStatus}
</span>

            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
          No recent orders found
        </div>
      )}
    </div>
  );
}

