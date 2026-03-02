import { motion } from "framer-motion";
import { Package, MoreHorizontal, Eye } from "lucide-react";

import { formatDate } from "../../utils/helpers";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

export default function RecentOrders({ orders, isLoading }) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-surface-hover rounded animate-pulse" />
            <div className="h-4 w-48 bg-surface-hover rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full bg-surface-hover rounded-xl animate-pulse"
            />
          ))}
        </div>
      </Card>
    );
  }

  if (!orders?.length) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center py-12">
        <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-text-tertiary" />
        </div>
        <h3 className="text-lg font-medium text-text-primary">No orders yet</h3>
        <p className="text-text-secondary max-w-sm mt-2">
          When customers place orders, they will appear here.
        </p>
      </Card>
    );
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "pending";
      case "processing":
        return "processing";
      case "shipped":
        return "shipped";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      default:
        return "default";
    }
  };

  return (
    <Card className="h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Recent Orders
          </h3>
          <p className="text-sm text-text-secondary">
            Latest transactions from your store
          </p>
        </div>
        <button className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 text-left">
              <th className="pb-3 text-xs font-medium text-text-tertiary uppercase tracking-wider pl-4">
                Order ID
              </th>
              <th className="pb-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Customer
              </th>
              <th className="pb-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Status
              </th>
              <th className="pb-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Amount
              </th>
              <th className="pb-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Date
              </th>
              <th className="pb-3 text-xs font-medium text-text-tertiary uppercase tracking-wider pr-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/50">
            {orders.map((order, index) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-surface-hover/50 transition-colors"
              >
                <td className="py-4 pl-4">
                  <span className="font-mono text-xs font-medium text-text-secondary bg-surface-hover px-2 py-1 rounded">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                </td>

                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary border border-white/5">
                      {order.shippingAddress?.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {order.shippingAddress?.fullName || "Guest User"}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {order.orderItems.length} items
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-4">
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </td>

                <td className="py-4">
                  <span className="text-sm font-semibold text-text-primary">
                    ${order.totalPrice?.toFixed(2)}
                  </span>
                </td>

                <td className="py-4">
                  <span className="text-xs text-text-secondary">
                    {formatDate(order.createdAt)}
                  </span>
                </td>

                <td className="py-4 pr-4 text-right">
                  <button className="p-1.5 rounded-lg text-text-tertiary hover:text-primary hover:bg-primary/10 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
