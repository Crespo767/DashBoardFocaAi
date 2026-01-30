import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { MobileBottomNav } from "./MobileBottomNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    // bg-background agora puxa o #F8FAFC definido no CSS acima
    <div className="min-h-screen bg-background text-foreground font-sans">
      
      {/* Top Navigation - Onde ficarão os botões principais */}
      <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80">
        <TopNav />
      </div>

      {/* Mobile Bottom Navigation (Apenas em telas pequenas) */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>

      {/* Main Content */}
      <main className="pb-24 pt-4 md:pb-8 md:pt-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}