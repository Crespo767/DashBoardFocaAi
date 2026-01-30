import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, CheckCircle, CalendarDays, RefreshCw } from "lucide-react";
import { format, isSameDay, parseISO, addMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricDisplay } from "@/components/dashboard/MetricDisplay";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EventsList } from "@/components/schedule/EventsList";
import { UpcomingEventsCard } from "@/components/schedule/UpcomingEventsCard";
import { sql } from "@/lib/neon";

interface ScheduleEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  google_event_id: string | null;
  lembrete_1h_enviado: boolean;
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchEvents = async (isBackgroundUpdate = false) => {
    if (!user) return;
    try {
      if (!isBackgroundUpdate) setLoading(true);
      
      const bufferTime = addMinutes(new Date(), -30).toISOString();
      
      const data = await sql`
        SELECT * FROM agendamento 
        WHERE user_id = ${user.id} 
        AND start_time >= ${bufferTime}
        ORDER BY start_time ASC
      `;
      
      const formattedEvents = data.map((e: any) => ({
          ...e,
          id: String(e.id),
          start_time: new Date(e.start_time).toISOString(),
          end_time: e.end_time ? new Date(e.end_time).toISOString() : null
      }));
      
      setEvents(formattedEvents);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      if (!isBackgroundUpdate) setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(() => fetchEvents(true), 60000);
    return () => clearInterval(interval);
  }, [user]);

  const filteredEvents = events.filter((event) =>
    isSameDay(parseISO(event.start_time), selectedDate)
  );

  const eventsToday = events.filter((event) => 
    isSameDay(parseISO(event.start_time), new Date())
  );

  const syncedCount = events.filter((e) => e.google_event_id).length;
  const eventDates = events.map((e) => parseISO(e.start_time));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center flex-col gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground animate-pulse">Sincronizando agenda...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Agenda"
        description="Próximos compromissos em tempo real"
        icon={<CalendarIcon className="h-6 w-6" />}
        actions={
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Atualizado às {format(lastUpdated, "HH:mm")}
            </div>
        }
      />

      <div className="mb-8 grid gap-3 grid-cols-2 sm:grid-cols-3">
        <MetricDisplay
          label="Total na Agenda"
          value={events.length}
          variant="schedule"
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricDisplay
          label="Eventos Hoje"
          value={eventsToday.length}
          variant="training"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <MetricDisplay
          label="Sincronizados"
          value={syncedCount}
          variant="health"
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      <div className="mb-6">
          <UpcomingEventsCard events={events} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <motion.div
          className="rounded-xl border bg-card p-4 sm:p-6 overflow-hidden flex justify-center h-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-full max-w-[350px]">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              modifiers={{ hasEvent: eventDates }}
              modifiersStyles={{
                hasEvent: {
                  backgroundColor: "hsl(262 83% 58% / 0.15)",
                  borderRadius: "50%",
                  fontWeight: "bold",
                  color: "hsl(262 83% 58%)"
                },
              }}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="rounded-md border-none w-full"
            />
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border bg-card p-4 sm:p-6 lg:col-span-2 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
            Eventos em {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
          <EventsList events={filteredEvents} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}