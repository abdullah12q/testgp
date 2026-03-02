import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

function AnimatedNumber({ value, duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setDisplayValue(Math.floor(value * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return displayValue.toLocaleString();
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  loading = false,
  prefix = "",
  suffix = "",
  className,
}) {
  const isPositive = trend === "up" || (trendValue && trendValue > 0);

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-2xl bg-surface border border-border p-6",
          className,
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-surface-hover rounded animate-pulse" />
            <div className="h-8 w-32 bg-surface-hover rounded animate-pulse" />
          </div>
          <div className="h-10 w-10 bg-surface-hover rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const numericValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.-]+/g, ""))
      : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6",
        "bg-surface border border-border",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        "transition-all duration-300",
        className,
      )}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-text-primary tracking-tight">
              {prefix}
              {typeof numericValue === "number" ? (
                <AnimatedNumber value={numericValue} />
              ) : (
                value
              )}
              {suffix}
            </span>
          </div>

          {(trend || trendValue !== undefined) && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border",
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20",
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {trendValue ? `${Math.abs(trendValue)}%` : ""}
              </span>
              <span className="text-xs text-text-tertiary">vs last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-hover text-text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
    </motion.div>
  );
}
