'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';


export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p className="mt-12 text-center text-xl">You have no orders yet.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="bg-white p-4 rounded shadow space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Order ID: {order._id}</span>
            <span
              className={`px-2 py-1 rounded text-white ${
                order.status === 'pending' ? 'bg-yellow-500' :
                order.status === 'paid' ? 'bg-blue-500' :
                order.status === 'shipped' ? 'bg-indigo-500' :
                order.status === 'delivered' ? 'bg-green-500' :
                'bg-red-500'
              }`}
            > 
              {order.status.toUpperCase()}
            </span>
          </div>

          {/* Order Items */}
{/* Order Items */}
<div className="space-y-1 mt-2">
  {Array.isArray(order.items) && order.items.length > 0 ? (
    order.items.map((item) => (
      <div key={item.productId || item._id} className="flex justify-between items-center">
        <span>{item.title || 'Unknown Product'} x {item.quantity || 0}</span>
        <span>${((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</span>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No items in this order</p>
  )}
</div>


          <div className="flex justify-end font-bold mt-2">
           Total: ${Number(order?.total || 0).toFixed(2)}
          </div>

          <Link
            href={`/orders/${order._id}`}
            className="text-blue-500 hover:underline"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}
