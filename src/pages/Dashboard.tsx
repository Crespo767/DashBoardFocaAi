import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format, addMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FinanceSummaryCard } from "@/components/dashboard/FinanceSummaryCard";
import { HealthSummaryCard } from "@/components/dashboard/HealthSummaryCard";
import { ExpensesPieChart } from "@/components/dashboard/ExpensesPieChart";
import { ScheduleSummaryCard } from "@/components/dashboard/ScheduleSummaryCard";
import { AcademicSummaryCard } from "@/components/dashboard/AcademicSummaryCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { DateRangeSelector, DateRange, getDefaultDateRange } from "@/components/ui/date-range-selector";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { sql } from "@/lib/neon"; 

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string | null;
  category: string;
  transaction_date: string;
}

interface DashboardSummary {
  finances: { balance: number; income: number; expenses: number; };
  expensesByCategory: { name: string; value: number }[];
  recentTransactions: Transaction[];
  health: { waterToday: number; lastSleep: number | null; };
  academic: { totalDocs: number; tagCounts: { tag: string; count: number }[]; };
  schedule: {
    upcomingEvents: number;
    syncedEvents: number;
    nextEvents: {
      id: string;
      title: string;
      start_time: string;
      google_event_id: string | null;
    }[];
  };
  userName: string | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange(7));
  const [loading, setLoading] = useState(true);
  
  const [summary, setSummary] = useState<DashboardSummary>({
    finances: { balance: 0, income: 0, expenses: 0 },
    expensesByCategory: [],
    recentTransactions: [],
    health: { waterToday: 0, lastSleep: null },
    academic: { totalDocs: 0, tagCounts: [] },
    schedule: { upcomingEvents: 0, syncedEvents: 0, nextEvents: [] },
    userName: null,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const todayFormatted = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  useEffect(() => {
    let isMounted = true;

    async function fetchSummary() {
      try {
        if (!user) return;
        setLoading(true);

        const startDate = format(dateRange.from, "yyyy-MM-dd");
        const endDate = format(dateRange.to, "yyyy-MM-dd");
        const todayStr = format(new Date(), "yyyy-MM-dd");

        // 1. FINANÇAS
        const finances = await sql`
          SELECT * FROM finances 
          WHERE user_id = ${user.id} 
          AND transaction_date >= ${startDate} 
          AND transaction_date <= ${endDate}
        `;

        const income = finances.filter((f: any) => f.type === 'income').reduce((acc: number, f: any) => acc + Number(f.amount), 0);
        const expenses = finances.filter((f: any) => f.type === 'expense').reduce((acc: number, f: any) => acc + Number(f.amount), 0);

        const categoryMap: Record<string, number> = {};
        finances.filter((f: any) => f.type === 'expense').forEach((f: any) => {
            const cat = f.category || "Geral";
            categoryMap[cat] = (categoryMap[cat] || 0) + Number(f.amount);
        });
          
        const expensesByCategory = Object.entries(categoryMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        const recentTransactions: Transaction[] = [...finances]
          .sort((a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
          .slice(0, 5)
          .map((f: any) => ({
            id: String(f.id),
            type: f.type as "income" | "expense",
            amount: Number(f.amount),
            description: f.description,
            category: f.category || "Geral",
            transaction_date: new Date(f.transaction_date).toISOString(),
          }));

        // 2. SAÚDE
        const healthData = await sql`
          SELECT * FROM health 
          WHERE user_id = ${user.id} 
          AND calendario >= ${todayStr}
        `;

        const waterToday = healthData.filter((h: any) => h.category === "Agua" || h.category === "agua").reduce((acc: number, h: any) => acc + Number(h.value), 0);
        const sleepResult = await sql`
            SELECT value FROM health 
            WHERE user_id = ${user.id} 
            AND (category = 'Sono' OR category = 'sono') 
            ORDER BY calendario DESC LIMIT 1
        `;
        const lastSleep = sleepResult.length > 0 ? Number(sleepResult[0].value) : null;

        // 3. ACADÊMICO
        const academicDocs = await sql`SELECT tags FROM academic WHERE user_id = ${user.id}`;
        const tagMap: Record<string, number> = {};
        academicDocs.forEach((doc: any) => { if(doc.tags) tagMap[doc.tags] = (tagMap[doc.tags] || 0) + 1; });
        const tagCounts = Object.entries(tagMap).map(([tag, count]) => ({ tag, count }));

        // 4. AGENDA
        const bufferTime = addMinutes(new Date(), -30).toISOString();
        const events = await sql`
          SELECT 
            id, 
            title, 
            start_time, 
            google_event_id 
          FROM agendamento 
          WHERE user_id = ${user.id} 
          AND start_time >= ${bufferTime} 
          AND status NOT IN ('cancelado', 'concluido')
          ORDER BY start_time ASC 
          LIMIT 5
        `;

        if (isMounted) {
          setSummary({
            finances: { balance: income - expenses, income, expenses },
            expensesByCategory,
            recentTransactions,
            health: { waterToday, lastSleep },
            academic: { totalDocs: academicDocs.length, tagCounts },
            schedule: { 
              upcomingEvents: events.length, 
              syncedEvents: events.filter((e: any) => e.google_event_id).length, 
              nextEvents: events.map((e: any) => ({
                  id: String(e.id),
                  title: e.title,
                  start_time: new Date(e.start_time).toISOString(),
                  google_event_id: e.google_event_id
              })) 
            },
            userName: user.name || "Usuário",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados no Neon:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSummary();
    return () => { isMounted = false; };
  }, [user, dateRange]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    </DashboardLayout>
  );

  if (!user) return (
    <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
            <h2 className="text-xl font-semibold">Sessão expirada ou não iniciada</h2>
            <p className="text-muted-foreground">Por favor, acesse novamente pelo link oficial.</p>
        </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <motion.div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-3xl font-bold text-[#040949]">{getGreeting()}, {summary.userName}! 👋</h1>
          <p className="text-muted-foreground capitalize mt-1">{todayFormatted}</p>
        </div>
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </motion.div>

      <section className="mb-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <FinanceSummaryCard balance={summary.finances.balance} income={summary.finances.income} expenses={summary.finances.expenses} />
          <ExpensesPieChart data={summary.expensesByCategory} total={summary.finances.expenses} />
          <RecentTransactions transactions={summary.recentTransactions} />
        </div>
      </section>

      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <HealthSummaryCard waterToday={summary.health.waterToday} lastSleep={summary.health.lastSleep} waterGoal={2500} sleepGoal={8} />
          <AcademicSummaryCard totalDocs={summary.academic.totalDocs} tagCounts={summary.academic.tagCounts} />
          <ScheduleSummaryCard upcomingEvents={summary.schedule.upcomingEvents} syncedEvents={summary.schedule.syncedEvents} nextEvents={summary.schedule.nextEvents} />
        </div>
      </section>
    </DashboardLayout>
  );
}