import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from "recharts";

interface TagCount {
  tag: string;
  count: number;
}

interface AcademicSummaryCardProps {
  totalDocs: number;
  tagCounts: TagCount[];
}

// Paleta "Acadêmica" Profissional (Tons de Azul e Cyan do Foca.aí)
const COLORS = [
  "#0026f7", // Azul Marca (Foca)
  "#3b82f6", // Blue 500
  "#0ea5e9", // Sky 500
  "#06b6d4", // Cyan 500
  "#6366f1", // Indigo 500
];

const tagLabels: Record<string, string> = {
  prova: "Provas",
  trabalho: "Trabalhos",
  leitura: "Leituras",
  estudo: "Estudos",
};

export function AcademicSummaryCard({ totalDocs, tagCounts }: AcademicSummaryCardProps) {
  // Prepara os dados e garante que sempre tenha cor
  const chartData = tagCounts.map((item, index) => ({
    name: tagLabels[item.tag] || item.tag,
    value: item.count,
    fill: COLORS[index % COLORS.length],
  }));

  // Ordena para os maiores ficarem primeiro visualmente
  chartData.sort((a, b) => b.value - a.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <Link to="/dashboard/academic" className="block group">
        <div className="rounded-xl border bg-card p-6 shadow-sm h-full transition-all hover:shadow-md hover:border-primary/50 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight">Acadêmico</h3>
                <p className="text-xs text-muted-foreground">Progresso e atividades</p>
              </div>
            </div>
            <motion.div
              className="rounded-full bg-secondary p-2 opacity-0 transition-opacity group-hover:opacity-100"
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>

          {/* Conteúdo Principal */}
          {chartData.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 items-center h-[180px]">
              
              {/* Coluna 1: Gráfico Donut com Total no Meio */}
              <div className="h-full w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45} // Buraco maior
                      outerRadius={65} // Anel mais fino e elegante
                      paddingAngle={4} // Espaço entre fatias
                      cornerRadius={4} // Bordas arredondadas
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      {/* Texto Centralizado */}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-2xl font-bold"
                                >
                                  {totalDocs}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 16}
                                  className="fill-muted-foreground text-[10px] uppercase tracking-wide font-medium"
                                >
                                  Itens
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [`${value} itens`, name]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Coluna 2: Legenda Customizada */}
              <div className="flex flex-col justify-center gap-2 pr-2">
                {chartData.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: item.fill }} 
                      />
                      <span className="text-muted-foreground truncate max-w-[80px] text-xs font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-xs">{item.value}</span>
                  </div>
                ))}
                {chartData.length > 4 && (
                  <p className="text-[10px] text-muted-foreground text-right pt-1">
                    +{chartData.length - 4} outros
                  </p>
                )}
              </div>

            </div>
          ) : (
            // Estado Vazio Elegante
            <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground">
              <div className="bg-secondary/50 p-4 rounded-full mb-3">
                <BookOpen className="h-6 w-6 opacity-40" />
              </div>
              <p className="text-sm font-medium">Sem atividades</p>
              <p className="text-xs text-muted-foreground/60">Adicione para começar</p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}