import { neon } from '@neondatabase/serverless';

// Tenta pegar a VITE_ (para desenvolvimento local) ou a DATABASE_URL (para produção segura)
const connectionString = import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("ERRO: DATABASE_URL não encontrada.");
}

export const sql = neon(connectionString);