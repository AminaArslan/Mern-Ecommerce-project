'use client';
import React from 'react';
import { MdInventory } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { FaShoppingCart, FaUsers } from 'react-icons/fa';

export default function StatsCards({ stats }) {
  const statsData = [
    {
      label: 'Products',
      value: stats.products,
      bg: 'bg-secondary',
      icon: <MdInventory size={36} />,
    },
    {
      label: 'Categories',
      value: stats.categories,
      bg: 'bg-accent',
      icon: <BiCategory size={36} />,
    },
    {
      label: 'Orders',
      value: stats.orders,
      bg: 'bg-deep',
      icon: <FaShoppingCart size={36} />,
    },
    {
      label: 'Users',
      value: stats.customers,
      bg: 'bg-dark',
      icon: <FaUsers size={36} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
      {statsData.map((item) => (
        <div
          key={item.label}
          className={`${item.bg} text-light p-6 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-default transform transition-all hover:scale-105 hover:shadow-2xl`}
        >
          {/* Icon with circular background */}
          <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            {item.icon}
          </div>

          {/* Value */}
          <span className="text-3xl font-bold">{item.value}</span>

          {/* Label */}
          <span className="text-lg mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
