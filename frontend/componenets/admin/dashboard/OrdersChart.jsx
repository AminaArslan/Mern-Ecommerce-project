'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

export default function OrdersLineChart({ data }) {
  return (
    <div className="bg-white dark:bg-dark p-6 rounded-xl shadow-lg mt-6 hover:shadow-2xl transition-shadow duration-300">
      <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-light">
        Weekly Orders
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a74848" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#d67878" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" stroke="#374151" tickLine={false} />
          <YAxis stroke="#374151" tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px', border: 'none' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Line
            type="monotone"
            dataKey="totalOrders"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: '#a74848' }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
