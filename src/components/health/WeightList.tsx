import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Scale, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeightListProps {
  data: { date: string; value: number }[];
}

export function WeightList({ data }: WeightListProps) {
  const [showAll, setShowAll] = useState(false);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
        <Scale className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm font-medium">Nenhum registro de peso</p>
      </div>
    );
  }

  const displayedData = showAll ? data : data.slice(0, 5);

  return (
    <div className="space-y-3">
      {displayedData.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Scale className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{item.value} kg</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              <span className="capitalize">
                {format(parseISO(item.date), "dd 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
      ))}

      {data.length > 5 && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-primary"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>Mostrar menos <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Ver histórico completo ({data.length}) <ChevronDown className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}