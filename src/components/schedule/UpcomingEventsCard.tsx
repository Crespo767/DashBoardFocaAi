import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UpcomingEvent {
  id: string;
  title: string;
  start_time: string;
  google_event_id: string | null;
}

interface UpcomingEventsCardProps {
  events: UpcomingEvent[];
  maxEvents?: number;
}

export function UpcomingEventsCard({ events, maxEvents = 5 }: UpcomingEventsCardProps) {
  const displayEvents = events.slice(0, maxEvents);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Próximos Compromissos</h3>
        </div>
      </div>

      {displayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
          <Clock className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">Nenhum compromisso próximo</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(event.start_time), "dd/MM 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              {event.google_event_id && (
                <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
