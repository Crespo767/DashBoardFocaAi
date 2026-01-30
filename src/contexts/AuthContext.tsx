import { createContext, useContext, ReactNode, useEffect, useState, useRef } from "react";
import { sql } from "@/lib/neon";

interface User {
  id: string;
  name: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // TRUQUE DE MESTRE: Captura o token IMEDIATAMENTE na montagem do componente.
  // O useState com função só roda uma vez, no primeiro milissegundo.
  // Isso garante que pegamos o token antes de qualquer redirecionamento limpar a URL.
  const [initialToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    
    // Se achou token, salva no localStorage como backup de emergência
    if (token) {
        window.localStorage.setItem("auth_token_temp", token);
        return token;
    }
    return null;
  });

  useEffect(() => {
    async function validarAcesso() {
      try {
        setLoading(true);

        // Prioridade: 1. Token capturado na entrada | 2. Token da URL atual | 3. Token salvo no storage
        let tokenParaValidar = initialToken;

        if (!tokenParaValidar) {
            const params = new URLSearchParams(window.location.search);
            tokenParaValidar = params.get("token");
        }
        
        // Recupera do storage se perdemos da URL (ex: refresh ou redirect agressivo)
        if (!tokenParaValidar) {
            tokenParaValidar = window.localStorage.getItem("auth_token_temp");
        }

        if (tokenParaValidar) {
          console.log("🔒 Token detectado:", tokenParaValidar);

          const tokenValido = await sql`
            SELECT user_id FROM access_tokens 
            WHERE token = ${tokenParaValidar} 
            AND used = false 
            AND expires_at > NOW() -- Se falhar, verifique o fuso horário UTC do banco
            LIMIT 1
          `;

          if (tokenValido && tokenValido.length > 0) {
            const userId = tokenValido[0].user_id;
            const userResult = await sql`SELECT id, name, phone FROM users WHERE id = ${userId} LIMIT 1`;

            if (userResult.length > 0) {
              console.log("✅ Usuário autenticado:", userResult[0].name);
              setUser({
                id: String(userResult[0].id),
                name: userResult[0].name,
                phone: userResult[0].phone
              });
              // Limpa o token temporário pois já foi usado com sucesso
              window.localStorage.removeItem("auth_token_temp");
            } 
          } else {
            console.warn("⚠️ Token inválido ou expirado.");
            window.localStorage.removeItem("auth_token_temp");
          }
        } else {
            console.log("ℹ️ Nenhum token para processar.");
        }

      } catch (error) {
        console.error("❌ Erro Auth:", error);
      } finally {
        setLoading(false);
      }
    }

    validarAcesso();
  }, [initialToken]);

  const signIn = async () => {};
  const signOut = () => { 
      setUser(null); 
      window.localStorage.removeItem("auth_token_temp");
      // Opcional: Redirecionar para login
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}