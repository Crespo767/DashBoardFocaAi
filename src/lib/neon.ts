import { neon } from '@neondatabase/serverless';

const connectionString = import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
  console.error("ERRO: VITE_DATABASE_URL não encontrada no .env");
}

// Exportamos a função 'sql' para fazer consultas
export const sql = neon(connectionString as string);