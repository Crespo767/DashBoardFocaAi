import { Link } from "react-router-dom";
import { Heart, Droplets, Moon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface HealthSummaryCardProps {
  waterToday: number;
  lastSleep: number | null;
  waterGoal?: number;
  sleepGoal?: number;
}

export function HealthSummaryCard({ 
  waterToday, 
  lastSleep, 
  waterGoal = 2000, 
  sleepGoal = 8 
}: HealthSummaryCardProps) {
  const waterPercentage = Math.min((waterToday / waterGoal) * 100, 100);
  const sleepPercentage = lastSleep ? Math.min((lastSleep / sleepGoal) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Link to="/dashboard/health" className="block group">
        <div className="rounded-xl border bg-card p-6 shadow-sm h-full transition-all hover:shadow-md hover:border-primary/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Saúde</h3>
            </div>
            <motion.div
              className="rounded-full bg-secondary p-2 opacity-0 transition-opacity group-hover:opacity-100"
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>

          {/* Water Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Água hoje</span>
              </div>
              <span className="text-sm text-muted-foreground">{waterToday}ml / {waterGoal}ml</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${waterPercentage}%` }}
              />
            </div>
          </div>

          {/* Sleep Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Último sono</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {lastSleep ? `${lastSleep}h` : "-"} / {sleepGoal}h
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${sleepPercentage}%` }}
              />
            </div>
          </div>

          {/* Goals info */}
          <div className="mt-4 pt-4 border-t flex justify-between text-xs text-muted-foreground">
            <span>Meta diária: {waterGoal}ml água</span>
            <span>Meta: {sleepGoal}h sono</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
