import { formatDate } from "../../utils/helpers";
import {
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import Badge from "../ui/Badge";
import { cn } from "../../utils/cn";

export default function OrderDetails({ order }) {
  if (!order) return null;

  const steps = [
    { status: "pending", label: "Order Placed", date: order.createdAt },
    { status: "processing", label: "Processing", date: null },
    { status: "shipped", label: "Shipped", date: null },
    { status: "delivered", label: "Delivered", date: null },
  ];

  const currentStep = steps.findIndex((step) => step.status === order.status);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-text-primary">
            Order #{order._id.slice(-6).toUpperCase()}
          </h3>
          <Badge variant={order.status} className="text-sm px-3 py-1">
            {order.status}
          </Badge>
        </div>
        <p className="text-text-secondary flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Timeline (Simplified) */}
      <div className="relative pl-4 border-l-2 border-border space-y-6">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.status} className="relative">
              <div
                className={cn(
                  "absolute -left-5.25 top-1 w-4 h-4 rounded-full border-2 transition-colors duration-300",
                  isCompleted
                    ? "bg-primary border-primary"
                    : "bg-surface border-border",
                  isCurrent && "ring-4 ring-primary/20",
                )}
              />
              <div
                className={cn(
                  "transition-opacity duration-300",
                  isCompleted ? "opacity-100" : "opacity-50",
                )}
              >
                <p className="text-sm font-medium text-text-primary">
                  {step.label}
                </p>
                {index === 0 && (
                  <p className="text-xs text-text-tertiary">
                    {formatDate(step.date)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border/50" />

      {/* Items */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Items
        </h4>
        <div className="space-y-3">
          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 p-3 rounded-xl bg-surface-hover/30 border border-border/50"
            >
              <div className="w-16 h-16 rounded-lg bg-surface border border-border overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">{item.name}</p>
                <p className="text-sm text-text-secondary">
                  Qty: {item.quantity}
                </p>
                <p className="text-sm font-semibold text-primary mt-1">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-border/50">
          <span className="font-medium text-text-secondary">Total Amount</span>
          <span className="text-xl font-bold text-text-primary">
            ${order.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Customer & Shipping */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Customer
          </h4>
          <div className="p-4 rounded-xl bg-surface-hover/30 border border-border/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-xs text-text-tertiary">
                  Customer ID:{" "}
                  {(order.user?._id || order.user)?.slice(-6) || "Guest"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Shipping Address
          </h4>
          <div className="p-4 rounded-xl bg-surface-hover/30 border border-border/50 flex gap-3">
            <MapPin className="w-5 h-5 text-text-tertiary shrink-0 mt-0.5" />
            <div className="text-sm text-text-secondary">
              <p className="text-text-primary font-medium">
                {order.shippingAddress.streetAddress}
              </p>
              <p>{order.shippingAddress.city}</p>
              <p>{order.shippingAddress.phoneNumber}</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Payment Info
          </h4>
          <div className="p-4 rounded-xl bg-surface-hover/30 border border-border/50 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-text-tertiary" />
            <div>
              <p className="text-sm font-medium text-text-primary capitalize">
                {order.paymentMethod}
              </p>
              <p className="text-xs text-success flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Paid via Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
