'use client';

import { useEffect, useState } from 'react';
import axios, { updateOrderStatus } from '@/lib/axios';
import { useAuth } from '@/context/authContext';
import toast from 'react-hot-toast';
import { FiSearch, FiEye, FiX, FiFilter, FiCalendar, FiMapPin, FiCreditCard, FiUser, FiChevronDown } from 'react-icons/fi';

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  canceled: 'bg-rose-50 text-rose-700 border-rose-200',
  refunded: 'bg-red-50 text-red-700 border-red-200',
};

const TAB_STATUSES = ['All', 'Pending', 'Shipped', 'Delivered', 'Canceled'];

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/orders/admin/all');
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
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
          o._id === orderId
            ? { ...o, orderStatus: updatedOrder.orderStatus, cancelledBy: updatedOrder.cancelledBy }
            : o
        )
      );

      toast.success(`Order updated to ${status.toUpperCase()}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(err.message || "Failed to update status");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'All' || order.orderStatus.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesTab;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    revenue: orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalPrice : 0), 0)
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header & Stats Strip */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-dark">Manage Orders</h1>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Track & Fulfill Customer Purchases
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-dark transition-all shadow-sm"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-serif font-bold text-dark">{stats.total}</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Total Orders</span>
          </div>
          <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-serif font-bold text-amber-600">{stats.pending}</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Pending</span>
          </div>
          <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-serif font-bold text-emerald-600">{stats.delivered}</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Delivered</span>
          </div>
          <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xl font-serif font-bold text-dark">Rs. {stats.revenue.toLocaleString()}</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Revenue (Paid)</span>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 border-b border-gray-100 hide-scrollbar scroll-smooth">
          {TAB_STATUSES.map(status => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-5 py-2 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap rounded-t-sm transition-all border-b-2 ${activeTab === status
                  ? 'border-dark text-dark bg-gray-50'
                  : 'border-transparent text-gray-400 hover:text-dark hover:bg-gray-50/50'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">Loading Orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiCreditCard size={24} className="text-gray-300" />
            </div>
            <h3 className="text-dark font-bold mb-1">No Orders Found</h3>
            <p className="text-gray-400 text-sm">No orders match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Itms</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">

                    <td className="px-6 py-4">
                      <span className="block text-xs font-bold text-dark font-mono">#{order._id.slice(-6).toUpperCase()}</span>
                      <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-dark">
                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                        </span>
                        <span className="text-[10px] text-gray-400">{order.shippingAddress?.city}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-sm">
                        {order.orderItems?.length || 0} Items
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-serif font-bold text-dark">
                          Rs.{Number(order.totalPrice).toLocaleString()}
                        </span>
                        <span className={`text-[9px] font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-emerald-500' :
                            order.paymentStatus === 'refunded' ? 'text-rose-500' : 'text-amber-500'
                          }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {order.orderStatus === 'canceled' ? (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS.canceled}`}>
                          Canceled
                        </span>
                      ) : (
                        <div className="relative">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`appearance-none pl-3 pr-8 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50 ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-500 border-gray-200'
                              } focus:ring-gray-300`}
                          >
                            {['pending', 'processing', 'shipped', 'delivered', 'canceled'].map(opt => (
                              <option key={opt} value={opt} className="bg-white text-dark">{opt}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <FiChevronDown size={14} />
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-sm transition-all"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="text-xl font-serif font-bold text-dark">Order Details</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">ID: #{selectedOrder._id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-dark transition-colors">
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <FiUser className="text-amber-600" /> Customer Info
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                    <p className="font-bold text-dark">{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.phone}</p>
                    <p className="text-sm text-gray-600 truncate">{selectedOrder.user?.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <FiMapPin className="text-amber-600" /> Shipping Address
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedOrder.shippingAddress?.address}, <br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode} <br />
                      {selectedOrder.shippingAddress?.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <FiCreditCard className="text-amber-600" /> Order Items
                </h4>
                <div className="border border-gray-100 rounded-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedOrder.orderItems?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium text-dark">{item.name}</td>
                          <td className="px-4 py-3 text-center text-gray-500">x{item.quantity}</td>
                          <td className="px-4 py-3 text-right font-serif">Rs.{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold text-dark border-t border-gray-100">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-right text-xs uppercase tracking-wide">Total Amount</td>
                        <td className="px-4 py-3 text-right font-serif text-amber-600">Rs.{Number(selectedOrder.totalPrice).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-4 border-t border-gray-50">
                <span className="flex items-center gap-1"><FiCalendar className="text-gray-400" /> Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                <span className="flex items-center gap-1">Payment: <b className="text-dark uppercase">{selectedOrder.paymentMethod}</b></span>
              </div>

            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition rounded-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
