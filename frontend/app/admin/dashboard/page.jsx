'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import axios from '@/lib/axios';
import StatsCards from '@/componenets/admin/dashboard/StatsCard';
import OrdersLineChart from '@/componenets/admin/dashboard/OrdersChart';
import CategoriesPieChart from '@/componenets/admin/dashboard/CategoriesPie';
import TopProducts from '@/componenets/admin/dashboard/TopProducts';
import RecentOrders from '@/componenets/admin/dashboard/RecentOrders';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0,
  });

  const [weeklyOrders, setWeeklyOrders] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(true);

  // ---------------- Fetch dashboard data ----------------
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Stats cards
        const statsRes = await axios.get('/admin/stats');

        // Weekly orders chart
        const weeklyRes = await axios.get('/orders/admin/weekly');

        // Products by parent category for Pie chart
        const categoriesRes = await axios.get('/products/admin/parent-category-stats');

        setStats(statsRes.data);
        setWeeklyOrders(weeklyRes.data);
        setCategoriesData(categoriesRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  // ---------------- Handle category click from Pie chart ----------------
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    console.log('Selected category:', category);
    // Optionally: filter TopProducts or other components by this category
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">
          Loading Overview...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-dark mb-2">Overview</h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Current Session</p>
          <p className="text-sm font-mono text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-sm shadow-xl border border-gray-100">
          <OrdersLineChart data={weeklyOrders} />
        </div>
        <div className="bg-white p-6 rounded-sm shadow-xl border border-gray-100">
          <CategoriesPieChart
            data={categoriesData}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top Products */}
        <div className="xl:col-span-1">
          <TopProducts category={selectedCategory} />
        </div>

        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
