import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Droplets, Moon, Dumbbell, Scale } from "lucide-react";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricDisplay } from "@/components/dashboard/MetricDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { WaterChart } from "@/components/health/WaterChart";
import { SleepChart } from "@/components/health/SleepChart";
import { HealthLog } from "@/components/health/HealthLog";
import { DateRangeSelector, DateRange, getDefaultDateRange } from "@/components/ui/date-range-selector";
import { sql } from "@/lib/neon";

interface HealthData {
  waterToday: number;
  waterGoal: number;
  sleepGoal: number;
  lastSleep: number | null;
  lastWeight: number | null;
  waterHistory: { date: string; value: number }[];
  sleepHistory: { date: string; value: number }[];
  workoutLog: { item: string; date: string }[];
}

export default function HealthPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange(30));
  const [data, setData] = useState<HealthData>({
    waterToday: 0,
    waterGoal: 2500,
    sleepGoal: 8,
    lastSleep: null,
    lastWeight: null,
    waterHistory: [],
    sleepHistory: [],
    workoutLog: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        setLoading(true);
        const todayStr = new Date().toISOString().split("T")[0];
        const startDate = format(dateRange.from, "yyyy-MM-dd");
        const endDate = format(dateRange.to, "yyyy-MM-dd");

        // QUERY SQL NEON - REMOVIDO ::integer
        const healthData = await sql`
          SELECT * FROM health 
          WHERE user_id = ${user.id} 
          AND calendario >= ${startDate} 
          AND calendario <= ${endDate}
          ORDER BY calendario ASC
        `;

        const waterToday = healthData
          .filter((h: any) => h.category === "agua" && new Date(h.calendario).toISOString().startsWith(todayStr))
          .reduce((acc: number, h: any) => acc + Number(h.value), 0);

        const waterMap = new Map<string, number>();
        healthData.filter((h: any) => h.category === "agua").forEach((h: any) => {
            const d = new Date(h.calendario).toISOString().split('T')[0];
            waterMap.set(d, (waterMap.get(d) || 0) + Number(h.value));
        });
        const waterHistory = Array.from(waterMap.entries()).map(([date, value]) => ({ date, value }));

        const sleepHistory = healthData
          .filter((h: any) => h.category === "sono")
          .map((h: any) => ({ 
              date: new Date(h.calendario).toISOString().split('T')[0], 
              value: Number(h.value) 
          }));

        // REMOVIDO ::integer NAS CONSULTAS INDIVIDUAIS
        const lastSleepRes = await sql`
            SELECT value FROM health 
            WHERE user_id = ${user.id} 
            AND category = 'sono' 
            ORDER BY calendario DESC LIMIT 1`;
            
        const lastWeightRes = await sql`
            SELECT value FROM health 
            WHERE user_id = ${user.id} 
            AND category = 'peso' 
            ORDER BY calendario DESC LIMIT 1`;
        
        const lastSleep = lastSleepRes.length ? Number(lastSleepRes[0].value) : null;
        const lastWeight = lastWeightRes.length ? Number(lastWeightRes[0].value) : null;

        const workoutLog = healthData
          .filter((h: any) => h.category === "treino")
          .map((h: any) => ({ item: h.item || "Treino", date: new Date(h.calendario).toISOString().split('T')[0] }));

        setData({
          waterToday,
          waterGoal: 2500,
          sleepGoal: 8,
          lastSleep,
          lastWeight,
          waterHistory,
          sleepHistory,
          workoutLog,
        });
      } catch (error) {
        console.error("Erro ao buscar dados de saúde:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, dateRange]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const waterPercentage = Math.min((data.waterToday / data.waterGoal) * 100, 100);

  return (
    <DashboardLayout>
      <PageHeader
        title="Saúde"
        description="Monitore seus hábitos diários"
        icon={<Heart className="h-6 w-6" />}
        actions={<DateRangeSelector value={dateRange} onChange={setDateRange} />}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricDisplay
          label="Água hoje"
          value={`${data.waterToday}ml`}
          variant="health"
          icon={<Droplets className="h-5 w-5" />}
          trend={waterPercentage >= 100 ? { value: 100, isPositive: true } : undefined}
        />
        <MetricDisplay
          label="Último sono"
          value={data.lastSleep ? `${data.lastSleep}h` : "-"}
          variant="training"
          icon={<Moon className="h-5 w-5" />}
        />
        <MetricDisplay
          label="Último peso"
          value={data.lastWeight ? `${data.lastWeight}kg` : "-"}
          variant="default"
          icon={<Scale className="h-5 w-5" />}
        />
        <MetricDisplay
          label="Treinos recentes"
          value={data.workoutLog.length}
          variant="training"
          icon={<Dumbbell className="h-5 w-5" />}
        />
      </div>

      <div className="mb-6 p-4 rounded-lg bg-secondary/50 flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-500" />
          <span>Meta de água: <strong>{data.waterGoal}ml/dia</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-orange-500" />
          <span>Meta de sono: <strong>{data.sleepGoal}h/noite</strong></span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          className="rounded-xl border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Droplets className="h-5 w-5 text-blue-500" />
            Consumo de água
          </h3>
          <WaterChart data={data.waterHistory} goal={data.waterGoal} />
        </motion.div>

        <motion.div
          className="rounded-xl border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Moon className="h-5 w-5 text-orange-500" />
            Horas de sono
          </h3>
          <SleepChart data={data.sleepHistory} goal={data.sleepGoal} />
        </motion.div>
      </div>

      <motion.div
        className="mt-6 rounded-xl border bg-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Dumbbell className="h-5 w-5 text-orange-500" />
          Histórico de treinos
        </h3>
        <HealthLog data={data.workoutLog} />
      </motion.div>
    </DashboardLayout>
  );
}