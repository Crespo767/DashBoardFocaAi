import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  // O segredo do banco só existe aqui no servidor
  const sql = neon(process.env.DATABASE_URL!);
  const { userId } = req.query;

  try {
    const data = await sql`SELECT * FROM finances WHERE user_id = ${userId} LIMIT 10`;
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar dados' });
  }
}