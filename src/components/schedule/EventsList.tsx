import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  google_event_id: string | null;
}

interface EventsListProps {
  events: ScheduleEvent[];
}

export function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
        <Calendar className="mb-2 h-10 w-10 opacity-50" />
        <p className="text-sm font-medium">Nenhum evento neste dia</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {events.map((event) => {
        const startTime = new Date(event.start_time);
        const endTime = event.end_time ? new Date(event.end_time) : null;
        const isSynced = !!event.google_event_id;

        return (
          <div
            key={event.id}
            className={cn(
              "group flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-sm",
              "bg-card border-l-4 border-l-purple-500"
            )}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate font-semibold text-foreground">{event.title}</h4>
                {isSynced && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                    <Cloud className="h-3 w-3" /> Sync
                  </span>
                )}
              </div>
              
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {format(startTime, "HH:mm", { locale: ptBR })}
                  {endTime && ` - ${format(endTime, "HH:mm", { locale: ptBR })}`}
                </span>
              </div>

              {event.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 bg-secondary/50 p-2 rounded-lg">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}