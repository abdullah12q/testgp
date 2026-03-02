import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Loader2 } from "lucide-react";

const CHART_DATA = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 2000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 1890 },
  { name: "Sat", value: 2390 },
  { name: "Sun", value: 3490 },
];

export default function RevenueChart({ className }) {
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);

  // Mock loading state when changing filters
  const handleFilterChange = (range) => {
    setTimeRange(range);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={cn(
        "p-6 rounded-2xl bg-surface border border-border h-100 relative",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Revenue</h3>
          <p className="text-sm text-text-secondary">Total revenue over time</p>
        </div>

        <div className="flex bg-surface-hover rounded-lg p-1 border border-border">
          {["24h", "7d", "30d", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => handleFilterChange(range)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                timeRange === range
                  ? "bg-background text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-70 w-full relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/50 backdrop-blur-sm rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                borderRadius: "8px",
                color: "#fafafa",
              }}
              itemStyle={{ color: "#818cf8" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
