'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { getMyOrders, cancelOrder } from '@/lib/axios'; // <- use cancelOrder for customer
import { toast } from 'react-hot-toast';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColor = {
    pending: 'bg-yellow-500',
    paid: 'bg-blue-500',
    shipped: 'bg-indigo-900',
    delivered: 'bg-green-800',
    canceled: 'bg-rose-700',
    cancelled: 'bg-red-500', // handle both spellings
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
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const updatedOrder = await cancelOrder(orderId); // <- call customer cancel route

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white dark:bg-dark p-4 rounded-lg shadow space-y-3 border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="font-semibold text-gray-800 dark:text-gray-200 ">
              Order ID: {order._id}
            </span>

            {/* Status badge */}
            <span
              className={`px-3 py-1 text-center rounded-full text-white text-sm font-medium ${
                statusColor[order.orderStatus || 'pending']
              }`}
            >
              {(order.orderStatus || 'pending').toUpperCase()}
            </span>
          </div>

          {/* Cancel Button (only for pending COD orders) */}
          {order.orderStatus === 'pending' && order.paymentMethod === 'COD' && (
            <div className="mt-2">
              <button
                onClick={() => handleCancelOrder(order._id)}
                className="bg-rose-700 text-white px-3 py-1 rounded-full hover:bg-rose-900 text-sm cursor-pointer "
              >
                Cancel Your Order
              </button>
            </div>
          )}

          {/* Payment Method */}
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            Payment Method: <span className="font-medium">{order.paymentMethod}</span>
          </p>

          {/* Order Items */}
          <div className="space-y-2 mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
            {order.orderItems?.length ? (
              order.orderItems.map((item, index) => (
                <div key={item._id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.name || 'product'}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span className="text-gray-800 dark:text-gray-200">
                      <span className="font-bold mr-1">{index + 1}.</span>
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

          {/* Totals */}
          <div className="flex justify-between font-bold mt-3 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2">
            <span>Total:</span>
            <span>Rs.{Number(order.totalPrice).toLocaleString('en-IN')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
