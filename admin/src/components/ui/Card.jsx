import { cn } from "../../utils/cn";

export default function Card({
  children,
  className,
  hover = false,
  glass = false,
  gradient = false,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        glass
          ? "bg-surface/60 backdrop-blur-xl border border-white/5"
          : "bg-surface border border-border",
        hover &&
          "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20",
        gradient &&
          "bg-linear-to-br from-surface to-surface-hover border-border/50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
