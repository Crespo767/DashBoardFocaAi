import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  variant: "finance" | "health" | "training" | "schedule";
  metrics?: ReactNode;
}

const variantStyles = {
  finance: "module-card-finance",
  health: "module-card-health",
  training: "module-card-training",
  schedule: "module-card-schedule",
};

const iconStyles = {
  finance: "icon-finance",
  health: "icon-health",
  training: "icon-training",
  schedule: "icon-schedule",
};

export function ModuleCard({
  title,
  description,
  icon,
  href,
  variant,
  metrics,
}: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={href} className="block">
        <div className={cn("module-card group", variantStyles[variant])}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className={cn("icon-container", iconStyles[variant])}>
              {icon}
            </div>
            <motion.div
              className="rounded-full bg-secondary p-2 opacity-0 transition-opacity group-hover:opacity-100"
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Metrics */}
          {metrics && (
            <div className="mt-4 border-t pt-4">
              {metrics}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
