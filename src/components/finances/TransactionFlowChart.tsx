import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionFlowChartProps {
  data: { date: string; income: number; expense: number }[];
}

export function TransactionFlowChart({ data }: TransactionFlowChartProps) {
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
    total: item.income - item.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
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
        <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
        <Bar
          dataKey="income"
          name="Receitas"
          fill="hsl(142, 71%, 45%)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expense"
          name="Despesas"
          fill="hsl(0, 84%, 60%)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
