import { Navigate } from "react-router-dom";

const Index = () => {
  // Simplesmente manda para o dashboard.
  // Se não tiver token, o ProtectedRoute lá no App.tsx vai barrar.
  return <Navigate to="/dashboard" replace />;
};

export default Index;