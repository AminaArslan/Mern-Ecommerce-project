'use client';
import React from 'react';
import { MdInventory } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { FaShoppingCart, FaUsers } from 'react-icons/fa';

export default function StatsCards({ stats }) {
  const statsData = [
    {
      label: 'Total Products',
      value: stats.products,
      bgIcon: 'bg-indigo-50 text-indigo-600',
      icon: <MdInventory size={24} />,
      border: 'border-l-4 border-indigo-500',
    },
    {
      label: 'Active Categories',
      value: stats.categories,
      bgIcon: 'bg-emerald-50 text-emerald-600',
      icon: <BiCategory size={24} />,
      border: 'border-l-4 border-emerald-500',
    },
    {
      label: 'Total Orders',
      value: stats.orders,
      bgIcon: 'bg-amber-50 text-amber-600',
      icon: <FaShoppingCart size={24} />,
      border: 'border-l-4 border-amber-500',
    },
    {
      label: 'Customers',
      value: stats.customers,
      bgIcon: 'bg-rose-50 text-rose-600',
      icon: <FaUsers size={24} />,
      border: 'border-l-4 border-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsData.map((item) => (
        <div
          key={item.label}
          className={`bg-white p-6 rounded-sm shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300 group ${item.border}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                {item.label}
              </p>
              <h3 className="text-3xl font-serif text-dark group-hover:scale-105 transition-transform origin-left">
                {item.value}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${item.bgIcon} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
