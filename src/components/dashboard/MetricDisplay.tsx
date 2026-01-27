import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricDisplayProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "finance" | "health" | "training" | "schedule";
}

const variantColors = {
  default: "text-foreground",
  finance: "text-finance",
  health: "text-health",
  training: "text-training",
  schedule: "text-schedule",
};

export function MetricDisplay({
  label,
  value,
  icon,
  trend,
  variant = "default",
}: MetricDisplayProps) {
  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className={cn("text-2xl font-bold", variantColors[variant])}>
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-health" : "text-destructive"
            )}
          >
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
