import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface TagCount {
  tag: string;
  count: number;
}

interface AcademicSummaryCardProps {
  totalDocs: number;
  tagCounts: TagCount[];
}

const tagColors: Record<string, string> = {
  prova: "hsl(0, 84%, 60%)",
  trabalho: "hsl(25, 95%, 53%)",
  leitura: "hsl(217, 91%, 60%)",
  estudo: "hsl(142, 71%, 45%)",
};

const tagLabels: Record<string, string> = {
  prova: "Provas",
  trabalho: "Trabalhos",
  leitura: "Leituras",
  estudo: "Estudos",
};

export function AcademicSummaryCard({ totalDocs, tagCounts }: AcademicSummaryCardProps) {
  const chartData = tagCounts.map((item) => ({
    name: tagLabels[item.tag] || item.tag,
    value: item.count,
    fill: tagColors[item.tag] || "hsl(var(--muted))",
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <Link to="/dashboard/academic" className="block group">
        <div className="rounded-xl border bg-card p-6 shadow-sm h-full transition-all hover:shadow-md hover:border-primary/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Acadêmico</h3>
            </div>
            <motion.div
              className="rounded-full bg-secondary p-2 opacity-0 transition-opacity group-hover:opacity-100"
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>

          {/* Total */}
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-primary">{totalDocs}</p>
            <p className="text-sm text-muted-foreground">documentos registrados</p>
          </div>

          {/* Pie Chart - Same style as expenses */}
          {chartData.length > 0 ? (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}`, name]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <GraduationCap className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Nenhum documento ainda</p>
            </div>
          )}

          {/* Legend */}
          {chartData.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
