import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  Heart,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Geral", href: "/dashboard", icon: LayoutDashboard },
  { name: "Finanças", href: "/dashboard/finances", icon: Wallet },
  { name: "Saúde", href: "/dashboard/health", icon: Heart },
  { name: "Estudo", href: "/dashboard/academic", icon: GraduationCap },
  { name: "Agenda", href: "/dashboard/schedule", icon: Calendar },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href} className="flex-1">
              <motion.div
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-xs",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
