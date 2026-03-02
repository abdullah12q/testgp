import { formatDate } from "../../utils/helpers";
import {
  Mail,
  Calendar,
  MapPin,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import Badge from "../ui/Badge";

export default function CustomerDetails({ customer, orders = [] }) {
  if (!customer) return null;

  console.log("customer", customer);

  // Calculate stats
  const customerOrders = orders.filter((order) => order.user === customer._id);
  const totalSpend = customerOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0,
  );
  const averageOrderValue =
    customerOrders.length > 0 ? totalSpend / customerOrders.length : 0;

  return (
    <div className="space-y-8">
      {/* Header Profile */}
      <div className="flex flex-col items-center pb-6 space-y-3 text-center border-b border-border">
        <div className="w-24 h-24 overflow-hidden border-4 rounded-full shadow-2xl border-surface ring-1 ring-border">
          <img
            src={
              customer.imageUrl ||
              `https://ui-avatars.com/api/?name=${customer.name}&background=random`
            }
            alt={customer.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-text-primary">
            {customer.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1 text-text-secondary">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{customer.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-1 text-text-tertiary">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">
              Joined {formatDate(customer.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 space-y-1 border rounded-xl bg-surface-hover/30 border-border/50">
          <div className="flex items-center gap-2 text-text-secondary">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {customerOrders.length}
          </p>
        </div>
        <div className="p-4 space-y-1 border rounded-xl bg-surface-hover/30 border-border/50">
          <div className="flex items-center gap-2 text-text-secondary">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Total Spend</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            ${totalSpend.toFixed(2)}
          </p>
        </div>
        <div className="col-span-2 p-4 space-y-1 border rounded-xl bg-surface-hover/30 border-border/50">
          <div className="flex items-center gap-2 text-text-secondary">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">
              Avg. Order Value
            </span>
          </div>
          <p className="text-xl font-bold text-text-primary">
            ${averageOrderValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Addresses */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-text-secondary">
          <MapPin className="w-4 h-4" /> Addresses (
          {customer.addresses?.length || 0})
        </h4>
        <div className="space-y-3">
          {customer.addresses && customer.addresses.length > 0 ? (
            customer.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-3 text-sm border rounded-lg border-border bg-surface text-text-secondary"
              >
                <p className="font-medium text-text-primary">
                  {addr.label || "Address"}
                </p>
                <p>{addr.streetAddress}</p>
                <p>{addr.city}</p>
                {addr.phoneNumber && <p>{addr.phoneNumber}</p>}
              </div>
            ))
          ) : (
            <p className="text-sm italic text-text-tertiary">
              No addresses saved
            </p>
          )}
        </div>
      </div>

      {/* Recent Orders History */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-text-secondary">
          <Package className="w-4 h-4" /> Recent Orders
        </h4>
        <div className="space-y-3">
          {customerOrders.length > 0 ? (
            customerOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-3 transition-colors border rounded-lg border-border bg-surface hover:bg-surface-hover"
              >
                <div>
                  <p className="font-medium text-text-primary">
                    #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-text-primary">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                  <Badge
                    variant={order.status}
                    className="origin-right scale-75"
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm italic text-text-tertiary">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
