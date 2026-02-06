'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import axios from '@/lib/axios';

const COLORS = {
  Women: '#4F46E5',
  Men: '#059669',
  Kids: '#D97706',
};

export default function CategoriesPieChart() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- Fetch category stats ----------------
  const fetchCategoryStats = async () => {
    try {
      const res = await axios.get('/products/admin/parent-category-stats');
      // Filter only active products if backend didn't already
      const activeData = (res.data || []).filter(entry => entry.qty > 0 && entry.isActive !== false);
      setData(activeData);
    } catch (err) {
      console.error('Error fetching category stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  const handleClick = (entry) => {
    if (!entry || !entry.category) return;
    setSelectedCategory(entry.category);
  };

  if (loading) return <p className="text-center mt-10 animate-pulse">Loading chart...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-black font-bold text-lg mb-3">Products by Category</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="qty"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label
            onClick={handleClick}
          >
            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={COLORS[entry.category] || '#8884d8'}
                cursor="pointer"
                stroke={selectedCategory === entry.category ? '#000' : ''}
                strokeWidth={selectedCategory === entry.category ? 2 : 0}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center mt-4 gap-4 sm:gap-6 flex-wrap">
        {['Women', 'Men', 'Kids'].map((cat) => (
          <div
            key={cat}
            className={`flex items-center cursor-pointer text-black ${selectedCategory === cat ? 'font-bold' : ''}`}
            onClick={() => handleClick({ category: cat })}
          >
            <span
              className="w-4 h-4 rounded-full mr-2 border"
              style={{
                backgroundColor: COLORS[cat],
                borderColor: selectedCategory === cat ? '#000' : 'transparent',
              }}
            ></span>
            <span>{cat}</span>
          </div>
        ))}
      </div>

      {/* Selected category info */}
      {selectedCategory && (
        <p className="text-center mt-2 text-sm text-gray-700">
          Showing products for <span className="font-semibold">{selectedCategory}</span>
        </p>
      )}
    </div>
  );
}
