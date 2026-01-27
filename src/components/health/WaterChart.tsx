import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WaterChartProps {
  data: { date: string; value: number }[];
  goal: number;
}

export function WaterChart({ data, goal }: WaterChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Nenhum registro de água ainda
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    dateLabel: format(parseISO(item.date), "EEE", { locale: ptBR }),
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="dateLabel" tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          formatter={(value: number) => [`${value}ml`, "Água"]}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <ReferenceLine y={goal} stroke="hsl(142, 71%, 45%)" strokeDasharray="5 5" label={{ value: `Meta: ${goal}ml`, fill: "hsl(142, 71%, 45%)" }} />
        <Bar dataKey="value" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
