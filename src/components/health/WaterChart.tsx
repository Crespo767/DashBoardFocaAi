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
        Nenhum registro de água no período
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
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
          dx={-10}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted)/0.5)" }}
          formatter={(value: number) => [`${value}ml`, "Água"]}
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
          fill="hsl(199, 89%, 48%)" 
          radius={[4, 4, 0, 0]} 
          barSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}