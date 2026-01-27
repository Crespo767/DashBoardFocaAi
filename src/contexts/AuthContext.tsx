import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { sql } from "@/lib/neon";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
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
  
  useEffect(() => {
    async function loginAutomatico() {
      try {
        console.log("🔄 Conectando como Usuário 1...");

        // BUSCA DIRETA PELO ID 1
        const result = await sql`
            SELECT id, name, email 
            FROM users 
            WHERE id = 1 
            LIMIT 1
        `;

        if (result && result.length > 0) {
            const foundUser = result[0];
            console.log("✅ Usuário 1 Conectado:", foundUser.name);
            
            setUser({
                id: String(foundUser.id), // Garante que o frontend receba como string
                name: foundUser.name,
                email: foundUser.email
            });
        } else {
            console.error("❌ Usuário 1 não encontrado no banco.");
            // Fallback de segurança caso o banco esteja vazio
            setUser({ id: "1", name: "Usuario Fallback", email: "teste@foca.ai" });
        }

      } catch (error) {
        console.error("Erro na autenticação:", error);
      } finally {
        setLoading(false);
      }
    }

    loginAutomatico();
  }, []);

  const signIn = async () => {};
  const signOut = () => { setUser(null); };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}