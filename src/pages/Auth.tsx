import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, user, loading } = useAuth();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Bem-vindo de volta!", description: "Login realizado com sucesso." });
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({ title: "Conta criada!", description: "Você já pode acessar o Foca.Aí." });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-primary p-12 text-primary-foreground">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground">
              <Target className="h-7 w-7 text-primary" />
            </div>
            <span className="text-3xl font-bold">Foca.Aí</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <motion.h1 
            className="text-4xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Seu assessor pessoal executivo
          </motion.h1>
          <motion.p 
            className="text-lg opacity-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Gerencie suas finanças, saúde, estudos e compromissos em um só lugar. 
            Organização inteligente para uma vida mais produtiva.
          </motion.p>
          
          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-finance">
              <span className="text-sm font-bold text-white">💰</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-health">
              <span className="text-sm font-bold text-white">❤️</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-academic">
              <span className="text-sm font-bold text-white">📚</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-schedule">
              <span className="text-sm font-bold text-white">📅</span>
            </div>
          </motion.div>
        </div>

        <p className="text-sm opacity-60">
          © 2026 Foca.Aí. Empático, perspicaz e organizado.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Target className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Foca.Aí</span>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? "Entre para acessar seu dashboard"
                : "Comece a organizar sua vida hoje"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  {isLogin ? "Entrar" : "Criar conta"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin
                ? "Não tem conta? Crie uma agora"
                : "Já tem conta? Faça login"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
