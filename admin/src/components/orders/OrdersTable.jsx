import { formatDate } from "../../utils/helpers";
import { Eye } from "lucide-react";
import { cn } from "../../utils/cn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import Badge from "../ui/Badge";

export default function OrdersTable({
  orders,
  updateStatusMutation,
  isPendingMutation,
  onViewOrder,
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-surface">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-surface-hover/50">
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden lg:table-cell">Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="hidden md:table-cell">Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => {
            const totalQuantity = order.orderItems.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );

            return (
              <TableRow
                key={order._id}
                className="cursor-pointer group"
                onClick={() => onViewOrder && onViewOrder(order)}
              >
                <TableCell>
                  <span className="font-mono text-sm font-medium text-text-primary bg-surface-hover px-1.5 py-0.5 rounded">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium text-text-primary">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {order.shippingAddress.city}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">
                      {totalQuantity} items
                    </p>
                    <p className="text-xs text-text-tertiary truncate max-w-37.5">
                      {order.orderItems[0]?.name}
                      {order.orderItems.length > 1 &&
                        ` +${order.orderItems.length - 1} more`}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="font-semibold text-text-primary">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <span className="uppercase text-xs font-semibold text-text-secondary bg-surface-hover/50 px-2 py-1 rounded-md border border-border">
                    {order.paymentMethod}
                  </span>
                </TableCell>

                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatusMutation({
                          orderId: order._id,
                          status: e.target.value,
                        })
                      }
                      className={cn(
                        "appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50",
                        order.status === "pending" &&
                          "bg-amber-500/10 text-amber-500 border-amber-500/20",
                        order.status === "processing" &&
                          "bg-blue-500/10 text-blue-500 border-blue-500/20",
                        order.status === "shipped" &&
                          "bg-violet-500/10 text-violet-500 border-violet-500/20",
                        order.status === "delivered" &&
                          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        order.status === "cancelled" &&
                          "bg-red-500/10 text-red-500 border-red-500/20",
                      )}
                      disabled={isPendingMutation}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <span className="text-xs text-text-tertiary font-mono">
                    {formatDate(order.createdAt)}
                  </span>
                </TableCell>

                <TableCell onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onViewOrder && onViewOrder(order)}
                    className="p-2 transition-colors duration-200 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
