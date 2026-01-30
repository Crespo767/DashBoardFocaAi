import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SleepChartProps {
  data: { date: string; value: number }[];
  goal?: number;
}

export function SleepChart({ data, goal = 8 }: SleepChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Nenhum registro de sono no período
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
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis 
          dataKey="dateLabel" 
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          domain={[0, 12]} 
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
          dx={-10}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted)/0.5)" }}
          formatter={(value: number) => [`${value}h`, "Sono"]}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
          }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
        />
        <ReferenceLine 
          y={goal} 
          stroke="hsl(142, 71%, 45%)" 
          strokeDasharray="5 5" 
          label={{ value: `Meta`, position: 'right', fill: "hsl(142, 71%, 45%)", fontSize: 10 }} 
        />
        <Bar 
          dataKey="value" 
          fill="hsl(25, 95%, 53%)" // Laranja para Sono
          radius={[4, 4, 0, 0]} 
          barSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}