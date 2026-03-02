import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getDashboardStats, getAllOrders } from "../utils/http";
import { DollarSign, ShoppingBag, Users, CreditCard } from "lucide-react";

import StatCard from "../components/ui/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import RecentOrders from "../components/dashboard/RecentOrders";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getDashboardStats,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  const recentOrders = ordersData?.orders?.slice(0, 5) || [];

  // Calculate AOV
  const averageOrderValue =
    statsData?.totalRevenue && statsData?.totalOrders
      ? statsData.totalRevenue / statsData.totalOrders
      : 0;

  const stats = [
    {
      title: "Total Revenue",
      value: statsData?.totalRevenue || 0,
      prefix: "$",
      icon: DollarSign,
      trend: "up",
      trendValue: 12.5,
    },
    {
      title: "Total Orders",
      value: statsData?.totalOrders || 0,
      icon: ShoppingBag,
      trend: "up",
      trendValue: 8.2,
    },
    {
      title: "Total Customers",
      value: statsData?.totalCustomers || 0,
      icon: Users,
      trend: "up",
      trendValue: 5.4,
    },
    {
      title: "Avg. Order Value",
      value: averageOrderValue.toFixed(2),
      prefix: "$",
      icon: CreditCard, // Changed icon for variety
      trend: "down",
      trendValue: -2.1,
    },
  ];

  return (
    <div className="pb-10 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Dashboard
        </h1>
        <p className="text-text-secondary">
          Overview of your store's performance
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <StatCard {...stat} loading={statsLoading} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Revenue Chart - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Recent Orders - Takes 1 column */}
        <div className="lg:col-span-1">
          <RecentOrders orders={recentOrders} isLoading={ordersLoading} />
        </div>
      </div>
    </div>
  );
}
