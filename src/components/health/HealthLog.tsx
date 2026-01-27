import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dumbbell } from "lucide-react";

interface HealthLogProps {
  data: { item: string; date: string }[];
}

export function HealthLog({ data }: HealthLogProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        Nenhum treino registrado ainda
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((workout, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-lg border bg-secondary/50 p-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-training-light">
            <Dumbbell className="h-5 w-5 text-training" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{workout.item}</p>
            <p className="text-sm text-muted-foreground">
              {format(parseISO(workout.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
