import { BookOpen, FileText, Pencil, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagCount {
  tag: string;
  count: number;
}

interface TagsOverviewProps {
  data: TagCount[];
}

const tagConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  prova: { label: "Provas", icon: <Pencil className="h-5 w-5" />, color: "bg-destructive text-white" },
  trabalho: { label: "Trabalhos", icon: <FileText className="h-5 w-5" />, color: "bg-training text-white" },
  leitura: { label: "Leituras", icon: <BookOpen className="h-5 w-5" />, color: "bg-health text-white" },
  estudo: { label: "Estudos", icon: <GraduationCap className="h-5 w-5" />, color: "bg-finance text-white" },
};

export function TagsOverview({ data }: TagsOverviewProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        Sem categorias ainda
      </div>
    );
  }

  const totalDocs = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const config = tagConfig[item.tag] || {
          label: item.tag,
          icon: <FileText className="h-5 w-5" />,
          color: "bg-muted",
        };
        const percentage = totalDocs > 0 ? (item.count / totalDocs) * 100 : 0;

        return (
          <div key={item.tag} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", config.color)}>
                  {config.icon}
                </div>
                <span className="font-medium">{config.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">{item.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full transition-all duration-500", config.color)}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
