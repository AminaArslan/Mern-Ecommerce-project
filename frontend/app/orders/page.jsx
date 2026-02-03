'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { getMyOrders, cancelOrder } from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { FaCircle } from 'react-icons/fa';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    paid: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    canceled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
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
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const updatedOrder = await cancelOrder(orderId);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: updatedOrder.orderStatus, paymentStatus: updatedOrder.paymentStatus }
            : order
        )
      );

      toast.success('Order cancelled successfully');
    } catch (err) {
      console.error('Error canceling order:', err);
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  if (loading)
    return (
      <p className="mt-12 text-center text-gray-700 dark:text-gray-300 animate-pulse">
        Loading your orders...
      </p>
    );

  if (!orders.length)
    return (
      <p className="mt-12 text-center text-xl text-gray-700 dark:text-gray-300">
        You have no orders yet.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white dark:bg-dark p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Order ID: {order._id.slice(-8)}
            </span>

            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[order.orderStatus || 'pending']}`}
            >
              <FaCircle className="text-[10px]" />
              {(order.orderStatus || 'pending').toUpperCase()}
            </span>
          </div>

          {/* Cancel Button */}
          {order.orderStatus === 'pending' && order.paymentMethod === 'COD' && (
            <div className="mt-3">
              <button
                onClick={() => handleCancelOrder(order._id)}
                className="bg-rose-700 text-white px-4 py-1 rounded-full hover:bg-rose-900 font-medium transition-colors duration-200"
              >
                Cancel Your Order
              </button>
            </div>
          )}

          {/* Payment Method */}
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Payment Method: <span className="font-medium">{order.paymentMethod}</span>
          </p>

          {/* Order Items */}
          <div className="space-y-3 mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            {order.orderItems?.length ? (
              order.orderItems.map((item, idx) => (
                <div key={item._id || idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name || 'product'}
                        className="w-14 h-14 object-cover rounded-xl"
                      />
                    )}
                    <span className="text-gray-800 dark:text-gray-200">
                      <span className="font-bold mr-1">{idx + 1}.</span>
                      {item.name} x {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Rs.{Number(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No items in this order</p>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-between font-bold mt-4 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2 text-lg">
            <span>Total:</span>
            <span>Rs.{Number(order.totalPrice).toLocaleString('en-IN')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
