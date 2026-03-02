import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllOrders, queryClient, updateOrderStatus } from "../utils/http";
import NoOrders from "../components/orders/NoOrders"; // Assuming this exists or using generic EmptyState
import OrdersTable from "../components/orders/OrdersTable";
import Drawer from "../components/ui/Drawer";
import OrderDetails from "../components/orders/OrderDetails";
import SkeletonLoader from "../components/ui/SkeletonLoader"; // Or generic skeleton
import { cn } from "../utils/cn";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: ordersData = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  const { mutate: updateStatusMutation, isPending: isPendingMutation } =
    useMutation({
      mutationFn: updateOrderStatus,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
        toast.success("Order status updated successfully");
      },
      onError: (error) => {
        console.error("Failed to update status:", error);
        toast.error("Failed to update order status");
      },
    });

  const orders = ordersData?.orders || [];

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const getStatusCount = (status) => {
    if (status === "all") return orders.length;
    return orders.filter((order) => order.status === status).length;
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Orders
        </h1>
        <p className="text-text-secondary mt-1">
          Manage customer orders and track their status
        </p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-surface border border-border rounded-xl w-fit">
        {STATUS_FILTERS.map((filter) => {
          const count = getStatusCount(filter.value);
          const isActive = statusFilter === filter.value;

          return (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-background text-primary shadow-sm ring-1 ring-border"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
              )}
            >
              {filter.label}
              <span
                className={cn(
                  "ml-2 text-xs py-0.5 px-1.5 rounded-md",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-surface-hover text-text-tertiary",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="min-h-100">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 w-full bg-surface-hover rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-2xl">
            <p className="text-text-secondary">No orders found</p>
          </div>
        ) : (
          <OrdersTable
            orders={filteredOrders}
            updateStatusMutation={updateStatusMutation}
            isPendingMutation={isPendingMutation}
            onViewOrder={handleViewOrder}
          />
        )}
      </div>

      {/* Order Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Order Details"
      >
        <OrderDetails order={selectedOrder} />
      </Drawer>
    </div>
  );
}
