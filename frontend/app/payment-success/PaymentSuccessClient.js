'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/axios';
import { useCart } from '@/context/cartContext';

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart, cart } = useCart();

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

  // if (loading) return <p className="text-center mt-12">Loading...</p>; 
  if (error) return <p className="text-center mt-12 text-red-500">{error}</p>;
  if (!order) return <p className="text-center mt-12">Order not found!</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="mb-2">
        Thank you, <span className="font-medium">{order.shippingAddress.firstName}</span>.
      </p>
      <p className="mb-2">
        Order ID: <span className="font-medium">{order._id}</span>
      </p>
      <p className="mb-6">
        Total Paid:{' '}
        <span className="font-medium">
          Rs.{order.totalPrice.toLocaleString('en-IN')}
        </span>
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Items:</h2>
        <ul className="space-y-3">
          {order.orderItems.map((item) => (
            <li key={item.product} className="flex items-center gap-4 border p-3 rounded">
                {/* <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                /> */}
              <div>
                <p className="font-medium">{item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: Rs.{item.price.toLocaleString('en-IN')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => router.push('/orders')}
        className="bg-accent text-light py-2 px-4 rounded hover:bg-dark cursor-pointer"
      >
        View My Orders
      </button>
    </div>
  );
}
