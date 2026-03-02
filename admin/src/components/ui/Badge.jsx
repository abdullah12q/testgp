import { cn } from "../../utils/cn";

const variants = {
  pending:
    "bg-amber-500/10 text-amber-500 border-amber-500/20 ring-amber-500/20",
  processing:
    "bg-blue-500/10 text-blue-500 border-blue-500/20 ring-blue-500/20",
  shipped:
    "bg-violet-500/10 text-violet-500 border-violet-500/20 ring-violet-500/20",
  delivered:
    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 ring-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/20",
  success:
    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 ring-emerald-500/20",
  warning:
    "bg-amber-500/10 text-amber-500 border-amber-500/20 ring-amber-500/20",
  error: "bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/20",
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20 ring-blue-500/20",
  default: "bg-surface text-text-secondary border-border ring-border/50",
};

export default function Badge({
  children,
  variant = "default",
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ring-inset transition-colors duration-200",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
