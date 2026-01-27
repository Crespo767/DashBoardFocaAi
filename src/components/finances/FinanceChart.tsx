import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FinanceChartProps {
  data: { date: string; income: number; expense: number }[];
}

export function FinanceChart({ data }: FinanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Nenhuma transação registrada ainda
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    dateLabel: format(parseISO(item.date), "dd/MM", { locale: ptBR }),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="dateLabel" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          formatter={(value: number) =>
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)
          }
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          name="Receitas"
          stroke="hsl(142, 71%, 45%)"
          strokeWidth={2}
          dot={{ fill: "hsl(142, 71%, 45%)" }}
        />
        <Line
          type="monotone"
          dataKey="expense"
          name="Despesas"
          stroke="hsl(217, 91%, 60%)"
          strokeWidth={2}
          dot={{ fill: "hsl(217, 91%, 60%)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
