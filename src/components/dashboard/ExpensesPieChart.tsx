import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ExpenseCategory {
  name: string;
  value: number;
}

interface ExpensesPieChartProps {
  data: ExpenseCategory[];
  total: number;
}

const COLORS = [
  "hsl(217, 91%, 60%)",   // finance blue
  "hsl(142, 71%, 45%)",   // health green
  "hsl(25, 95%, 53%)",    // training orange
  "hsl(262, 83%, 58%)",   // schedule purple
  "hsl(199, 89%, 48%)",   // academic cyan
  "hsl(0, 84%, 60%)",     // destructive red
  "hsl(45, 93%, 47%)",    // yellow
  "hsl(280, 65%, 60%)",   // violet
];

export function ExpensesPieChart({ data, total }: ExpensesPieChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (data.length === 0) {
    return (
      <motion.div
        className="rounded-xl border bg-card p-6 shadow-sm h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-semibold text-lg mb-4">Despesas por Categoria</h3>
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          Nenhum gasto registrado
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Link to="/dashboard/finances" className="block group">
        <div className="rounded-xl border bg-card p-6 shadow-sm h-full transition-all hover:shadow-md hover:border-finance/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Despesas por Categoria</h3>
            <motion.div
              className="rounded-full bg-secondary p-2 opacity-0 transition-opacity group-hover:opacity-100"
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-48">
              {data.slice(0, 5).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground truncate max-w-20">{item.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
              {data.length > 5 && (
                <p className="text-xs text-muted-foreground">+{data.length - 5} categorias</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">Total de despesas</p>
            <p className="text-xl font-bold text-finance">{formatCurrency(total)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
