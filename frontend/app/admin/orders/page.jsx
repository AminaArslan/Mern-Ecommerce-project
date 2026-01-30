  'use client';

  import { useEffect, useState } from 'react';
  import axios, { updateOrderStatus } from '@/lib/axios';
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
    console.log("Attempting to update order:", orderId, status);
    const updatedOrder = await updateOrderStatus(orderId, status);

    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId ? { ...order, orderStatus: updatedOrder.orderStatus } : order
      )
    );

    console.log("Order status updated locally:", updatedOrder);
  } catch (err) {
    console.error("Failed to update status:", err);
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
                <th className="py-3 px-4 border-b border-dark text-left font-medium">Order items</th>
                <th className="py-3 px-4 border-b border-dark text-left font-medium">Customer Address</th>
                <th className="py-3 px-4 border-b border-dark text-left font-medium">payment</th>
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
                  
  {/* Order Items (Name + Quantity + Count) */}
  <td className="py-3 px-4 border-b border-dark text-dark max-w-[150px] text-sm space-y-1 break-words">
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
  {/* Payment Status */}
  <td className="py-3 px-4 border-b border-dark text-dark font-medium">
    {order.paymentMethod === 'Stripe' ? (
      <span className="text-green-600 font-semibold">Paid</span>
    ) : (
      <span className="text-yellow-600 font-semibold">Unpaid</span>
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
  <td className="py-3 px-4 border-b border-dark">
    <select
      value={order.orderStatus} // controlled by state
      onChange={(e) => handleStatusChange(order._id, e.target.value)}
      className={`border px-2 py-1 rounded ${
        statusColor[order.orderStatus]
      } text-sm cursor-pointer`}
    >
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status.toUpperCase()}
        </option>
      ))}
    </select>
  </td>


  {/* Status Dropdown
  <td className="py-3 px-4 border-b border-dark ">
    <select
      value={
        order.paymentMethod === 'Stripe' && order.paymentStatus === 'paid'
          ? 'paid'
          : order.orderStatus  
      }
      onChange={(e) => handleStatusChange(order._id, e.target.value)}
      className={`border px-2 py-1 rounded ${
        statusColor[
          order.paymentMethod === 'Stripe' && order.paymentStatus === 'paid'
            ? 'paid'
            : order.status
        ]
      } text-sm cursor-pointer`}
    >
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status.toUpperCase()}
        </option>
      ))}
    </select>
  </td> */}

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
