import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop"; // <--- 1. Importação nova

// Pages
// import Index from "./pages/Index"; // Não estamos usando o Index, vamos direto pro Dashboard
import Dashboard from "./pages/Dashboard";
import FinancesPage from "./pages/FinancesPage";
import HealthPage from "./pages/HealthPage";
import AcademicPage from "./pages/AcademicPage";
import SchedulePage from "./pages/SchedulePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente simples que apenas renderiza o conteúdo
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Redireciona a raiz direto para o dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/finances"
        element={
          <ProtectedRoute>
            <FinancesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/health"
        element={
          <ProtectedRoute>
            <HealthPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/academic"
        element={
          <ProtectedRoute>
            <AcademicPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/schedule"
        element={
          <ProtectedRoute>
            <SchedulePage />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop /> {/* <--- 2. Adicionado aqui para resetar o scroll */}
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;