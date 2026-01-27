import { Link } from "react-router-dom";
import { Calendar, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  start_time: string;
  google_event_id: string | null;
}

interface ScheduleSummaryCardProps {
  upcomingEvents: number;
  syncedEvents: number;
  nextEvents: Event[];
}

export function ScheduleSummaryCard({ upcomingEvents, syncedEvents, nextEvents }: ScheduleSummaryCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Amanhã";
    }
    return date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Link to="/dashboard/schedule" className="block group">
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-schedule/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-schedule/10">
                <Calendar className="h-5 w-5 text-schedule" />
              </div>
              <h3 className="font-semibold text-lg">Próximos Eventos</h3>
            </div>
            <motion.div
              className="rounded-full bg-secondary p-2 opacity-0 transition-opacity group-hover:opacity-100"
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-schedule/10 text-center">
              <p className="text-2xl font-bold text-schedule">{upcomingEvents}</p>
              <p className="text-xs text-muted-foreground">Próximos eventos</p>
            </div>
            <div className="p-3 rounded-lg bg-health/10 text-center">
              <p className="text-2xl font-bold text-health">{syncedEvents}</p>
              <p className="text-xs text-muted-foreground">Sincronizados</p>
            </div>
          </div>

          {/* Next Events */}
          <div className="space-y-2">
            {nextEvents.length > 0 ? (
              nextEvents.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <div className="text-center min-w-12">
                    <p className="text-xs font-medium text-schedule">{formatDate(event.start_time)}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(event.start_time)}</p>
                  </div>
                  <span className="text-sm truncate flex-1">{event.title}</span>
                  {event.google_event_id && (
                    <CheckCircle2 className="h-4 w-4 text-health flex-shrink-0" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum evento próximo
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
