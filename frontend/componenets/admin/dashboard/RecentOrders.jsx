// 'use client';
// import { useEffect, useState } from 'react';
// import axios from '@/lib/axios';

// export default function RecentOrders() {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchRecentOrders = async () => {
//       try {
//         const { data } = await axios.get('/orders/admin/all');
//         setOrders(data.slice(0, 5)); // top 5 recent orders
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchRecentOrders();
//   }, []);

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md mt-4">
//       <h2 className="font-bold text-lg mb-3">Recent Orders</h2>
//       <table className="w-full text-left border-collapse">
//         <thead>
//           <tr className="border-b">
//             <th>Order ID</th>
//             <th>Total</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map(order => (
//             <tr key={order._id} className="border-b">
//               <td>{order._id.slice(-6)}</td>
//               <td>${order.totalPrice}</td>
//               <td>{order.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }




'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Image from 'next/image';

export default function RecentOrdersCard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const { data } = await axios.get('/orders/admin/all');
        setOrders(data.slice(0, 5)); // top 5 recent orders
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecentOrders();
  }, []);

  return (
    <div className="bg-white dark:bg-dark p-4 rounded-xl shadow-lg mt-6 max-w-md">
      <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-light">
        Recent Orders
      </h2>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex items-center justify-between bg-primary/10 dark:bg-light/10 p-2 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Order ID circle */}
            <div className="w-10 h-10 rounded-full bg-accent text-light flex items-center justify-center font-mono text-sm">
              #{order._id.slice(-4)}
            </div>

            {/* Order Info */}
            <div className="flex-1 ml-3">
              <p className="text-sm font-semibold text-gray-800 dark:text-light">
                {order.orderItems?.[0]?.name || 'Product'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {order.orderItems?.[0]?.quantity || 1} item(s)
              </p>
            </div>

            {/* Total Price */}
            <p className="text-sm font-bold text-gray-800 dark:text-light">
              ${order.totalPrice}
            </p>

            {/* Status Badge */}
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                order.status === 'delivered'
                  ? 'bg-green-500 text-light'
                  : order.status === 'pending'
                  ? 'bg-yellow-500 text-light'
                  : 'bg-gray-400 text-light'
              }`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
