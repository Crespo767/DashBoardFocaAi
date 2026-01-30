import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/contexts/AuthContext"; // 1. Importei o useAuth
import ScrollToTop from "@/components/ScrollToTop";
import { LoadingSpinner } from "@/components/ui/loading-spinner"; // 2. Importei o Spinner para feedback visual

// Pages
import Dashboard from "./pages/Dashboard";
import FinancesPage from "./pages/FinancesPage";
import HealthPage from "./pages/HealthPage";
import AcademicPage from "./pages/AcademicPage";
import SchedulePage from "./pages/SchedulePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente simples que apenas renderiza o conteúdo
// (Seu Dashboard já trata o caso de 'sem usuário', então mantivemos simples)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function AppRoutes() {
  const { loading } = useAuth(); // 3. Pega o estado de carregamento do AuthContext

  // 4. BLOQUEIO DE SEGURANÇA:
  // Enquanto o AuthContext estiver verificando o token/banco,
  // nós mostramos um spinner e NÃO carregamos as rotas.
  // Isso impede que o <Navigate> rode e limpe a URL antes da hora.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner className="h-10 w-10 text-primary" />
        <span className="ml-3 text-muted-foreground animate-pulse">
          Validando acesso...
        </span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Se o usuário acessar a raiz /, redireciona para o dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Se o usuário acessar /login (com ou sem token), manda pro dashboard */}
      {/* O AuthContext já terá capturado o token antes desse redirecionamento acontecer */}
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />

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
          <ScrollToTop />
          {/* O AuthProvider envolve o AppRoutes para fornecer o contexto */}
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;