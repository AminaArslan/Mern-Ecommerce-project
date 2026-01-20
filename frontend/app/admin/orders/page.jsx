'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useAuth } from '@/context/authContext';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = ['pending', 'paid', 'shipped', 'delivered', 'canceled'];

  const statusColor = {
    pending: 'bg-accent/20 text-accent',
    paid: 'bg-primary/20 text-dark',
    shipped: 'bg-dark/20 text-dark',
    delivered: 'bg-deep/20 text-deep',
    canceled: 'bg-secondary/20 text-secondary',
  };

  // Fetch all orders from backend
// ✅ Top-level function
const fetchOrders = async () => {
  try {
    const { data } = await axios.get('/orders/admin/all');
    console.log("Fetched orders from backend:", data);
    setOrders(data);
  } catch (err) {
    console.error('Error fetching orders:', err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchOrders(); // ✅ call inside useEffect
}, []);

// ✅ Now handleStatusChange can also call it
const handleStatusChange = async (orderId, status) => {
  try {
    await axios.patch(`/orders/admin/status/${orderId}`, { status });
    fetchOrders(); // ✅ works fine now
  } catch (err) {
    console.error('Error updating status:', err);
  }
};

  if (loading)
    return (
      <p className="text-dark text-center py-6 animate-pulse">
        Loading orders...
      </p>
    );

  if (!orders.length)
    return (
      <p className="text-dark text-center py-6">
        No orders found.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-dark">Manage Orders</h1>

      <div className="overflow-x-auto rounded-lg shadow-md border border-dark/30">
        <table className="min-w-full border-collapse">
          <thead className="bg-secondary text-light">
            <tr>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Order Name</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Customer Address</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Items</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Amount</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Payment</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Date</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Status</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-light">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-primary/20 transition-all">
                
                {/* Order Name (all product names in order) */}
                <td className="py-3 px-4 border-b border-dark font-medium text-dark max-w-xs truncate">
                  {order.orderItems?.map(item => item.name).join(', ')}
                </td>

                {/* Customer Shipping Address */}
                <td className="py-3 px-4 border-b border-dark text-dark text-sm space-y-1 max-w-xs wrap-break-word">
                  {order.shippingAddress?.firstName || order.shippingAddress?.lastName ? (
                    <div>
                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                    </div>
                  ) : null}

                  {order.shippingAddress?.phone && (
                    <div className="text-gray-500">{order.shippingAddress.phone}</div>
                  )}

                  {order.shippingAddress?.address && (
                    <div className="text-gray-500">
                      {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                      {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </div>
                  )}
                </td>

                {/* Items with quantity */}
                <td className="py-3 px-4 border-b border-dark text-dark space-y-1 text-sm max-w-xs">
                  {order.orderItems?.map((item) => (
                    <div key={item.product}>
                       x {item.quantity}
                    </div>
                  ))}
                </td>

                {/* Amount */}
                <td className="py-3 px-4 border-b border-dark text-dark font-medium">
                  ${order.totalPrice.toFixed(2)}
                </td>

                {/* Payment Method */}
                <td className="py-3 px-4 border-b border-dark text-dark font-medium">
                  {order.paymentMethod || 'N/A'}
                </td>

                {/* Date */}
                <td className="py-3 px-4 border-b border-dark text-dark text-sm">
                  {new Date(order.createdAt).toLocaleDateString()} <br />
                  <span className="text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </td>

                {/* Status Dropdown */}
                <td className="py-3 px-4 border-b border-dark ">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`border px-2 py-1 rounded ${statusColor[order.status]} text-sm cursor-pointer`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 border-b border-dark">
                  <button
                    onClick={() => alert(JSON.stringify(order, null, 2))}
                    className="px-3 py-1 rounded bg-accent text-light hover:bg-dark transition hover:scale-105 text-sm w-full sm:w-auto cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
