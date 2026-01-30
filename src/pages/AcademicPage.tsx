import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Brain, CalendarClock, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricDisplay } from "@/components/dashboard/MetricDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AcademicList } from "@/components/academic/AcademicList";
import { TagsOverview } from "@/components/academic/TagsOverview";
import { sql } from "@/lib/neon";

interface AcademicItem {
  id: string;
  doc_name: string;
  summary: string | null;
  tags: string;
  created_at: string;
}

interface TagCount {
  tag: string;
  count: number;
}

export default function AcademicPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<AcademicItem[]>([]);
  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const data = await sql`
        SELECT * FROM academic 
        WHERE user_id = ${user.id} 
        ORDER BY created_at DESC
      `;

      const formattedItems = data.map((doc: any) => ({
          ...doc,
          id: String(doc.id),
          created_at: new Date(doc.created_at).toISOString()
      }));

      setItems(formattedItems);

      const tagMap = new Map<string, number>();
      formattedItems.forEach((doc: any) => {
        const count = tagMap.get(doc.tags) || 0;
        tagMap.set(doc.tags, count + 1);
      });
      setTagCounts(
        Array.from(tagMap.entries()).map(([tag, count]) => ({ tag, count }))
      );
      
    } catch (error) {
      console.error("Error fetching academic data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const totalActivities = items.length;
  const studySessions = items.filter((d) => d.tags === "estudo").length;
  const upcomingExams = items.filter((d) => d.tags === "prova" && new Date(d.created_at) > new Date()).length;
  const nextExam = items
    .filter((d) => d.tags === "prova" && new Date(d.created_at) > new Date())
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];

  return (
    <DashboardLayout>
      <PageHeader
        title="Acadêmico"
        description="Planejamento, estudos e provas"
        icon={<GraduationCap className="h-6 w-6" />}
      />

      <div className="mb-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
        <MetricDisplay
          label="Sessões Estudo"
          value={studySessions}
          variant="finance" 
          icon={<Brain className="h-5 w-5" />}
        />
        <MetricDisplay
          label="Provas Futuras"
          value={upcomingExams}
          variant="training" 
          icon={<CalendarClock className="h-5 w-5" />}
        />
        <MetricDisplay
          label="Total Atividades"
          value={totalActivities}
          variant="default"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <MetricDisplay
          label="Próxima Prova"
          value={nextExam ? format(new Date(nextExam.created_at), "dd/MM") : "Nenhuma"}
          variant="health"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <motion.div
          className="rounded-xl border bg-card p-4 sm:p-6 h-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="mb-4 text-lg font-semibold">Distribuição</h3>
          <TagsOverview data={tagCounts} />
        </motion.div>

        <motion.div
          className="rounded-xl border bg-card p-4 sm:p-6 lg:col-span-2 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 text-lg font-semibold">Cronograma de Atividades</h3>
          <AcademicList items={items} onRefresh={fetchData} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}