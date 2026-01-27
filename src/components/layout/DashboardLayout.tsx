import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { MobileBottomNav } from "./MobileBottomNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNav />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
