'use client';

import { useEffect, useState } from 'react';
import axios, { updateOrderStatus } from '@/lib/axios';
import { useAuth } from '@/context/authContext';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = ['pending', 'shipped', 'delivered', 'canceled'];

  const statusColor = {
    pending: 'bg-accent/20 text-accent',
    paid: 'bg-primary/20 text-dark',
    shipped: 'bg-dark/20 text-dark',
    delivered: 'bg-deep/20 text-deep',
    canceled: 'bg-secondary/20 text-secondary',
    cancelled: 'bg-secondary/20 text-secondary',
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/orders/admin/all');
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle status changes
const handleStatusChange = async (orderId, status) => {
  try {
    const order = orders.find(o => o._id === orderId);

    if (order.orderStatus === "canceled" && order.cancelledBy === "user") {
      toast.error("Cannot change order cancelled by user");
      return;
    }

    const updatedOrder = await updateOrderStatus(orderId, status.toLowerCase());

    setOrders(prevOrders =>
      prevOrders.map(o =>
        o._id === orderId ? { ...o, orderStatus: updatedOrder.orderStatus, cancelledBy: updatedOrder.cancelledBy } : o
      )
    );

    toast.success(`Order status updated to ${status.toUpperCase()}`);
  } catch (err) {
    console.error("Failed to update status:", err);
    toast.error(err.message || "Failed to update status");
  }
};


  if (loading)
    return <p className="text-dark text-center py-6 animate-pulse">Loading orders...</p>;

  if (!orders.length)
    return <p className="text-dark text-center py-6">No orders found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-dark">Manage Orders</h1>

      <div className="overflow-x-auto rounded-lg shadow-md border border-dark/30">
        <table className="min-w-full border-collapse">
          <thead className="bg-secondary text-light">
            <tr>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Order items</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Customer Address</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Payment</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Amount</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Method</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Date</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Status</th>
              <th className="py-3 px-4 border-b border-dark text-left font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-light">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-primary/20 transition-all">
                {/* Order Items */}
                <td className="py-3 px-4 border-b border-dark text-dark max-w-37.5 text-sm space-y-1 wrap-break-word">
                  {order.orderItems?.map((item, index) => (
                    <div key={item.product}>
                      <span className="font-bold mr-1">{index + 1}.</span>
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </td>

                {/* Customer Shipping Address */}
                <td className="py-3 px-4 border-b border-dark text-dark text-sm space-y-1 max-w-xs wrap-break-word">
                  {order.shippingAddress?.firstName || order.shippingAddress?.lastName ? (
                    <div>
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
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

                {/* Payment Status */}
                <td className="py-3 px-4 border-b border-dark text-dark font-medium">
                  {order.paymentStatus === 'paid' ? (
                    <span className="text-green-600 font-semibold">
                      {order.paymentMethod === 'COD' ? 'Paid (COD)' : 'Paid'}
                    </span>
                  ) : order.paymentStatus === 'refunded' ? (
                    <span className="text-red-600 font-semibold">Refunded</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      {order.paymentMethod === 'COD' ? 'Payment pending (COD)' : 'Unpaid'}
                    </span>
                  )}
                </td>

                {/* Amount */}
                <td className="py-3 px-4 border-b border-dark text-dark font-medium">
                  Rs.{Number(order.totalPrice).toLocaleString('en-IN')}
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
{/* Status */}
<td className="py-3 px-4 border-b border-dark">
  {order.orderStatus === "canceled" && order.cancelledBy === "user" ? (
    // 🔹 User-cancelled order → show read-only badge
    <span
      className={`px-3 py-1 text-rose-800 rounded-full bg-rose-300 text-sm font-medium ${statusColor["canceled"]}`}
    >
      CANCELED
    </span>
  ) : (
    // 🔹 Otherwise → show dropdown for admin
    <select
      value={order.orderStatus}
      onChange={(e) => handleStatusChange(order._id, e.target.value)}
      className={`border px-2 py-1 rounded ${statusColor[order.orderStatus]} text-sm cursor-pointer`}
    >
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status.toUpperCase()}
        </option>
      ))}
    </select>
  )}
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
