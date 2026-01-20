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
      <p className="text-dark text-center mt-10 text-lg animate-pulse">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold text-dark">Admin Dashboard</h1>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrdersLineChart data={weeklyOrders} />
        <CategoriesPieChart
          data={categoriesData}
          onCategoryClick={handleCategoryClick} // pass click callback
        />
      </div>

      {/* Top Products (optionally filtered by selected category) */}
      <TopProducts category={selectedCategory} />

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
}
