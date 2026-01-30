import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, PieChart, ArrowLeftRight, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricDisplay } from "@/components/dashboard/MetricDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TransactionFlowChart } from "@/components/finances/TransactionFlowChart";
import { CategoryPieChart } from "@/components/finances/CategoryPieChart";
import { DateRangeSelector, DateRange, getDefaultDateRange } from "@/components/ui/date-range-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sql } from "@/lib/neon";

interface FinanceData {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  categoryData: { name: string; value: number }[];
  dailyData: { date: string; income: number; expense: number }[];
}

export default function FinancesPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange(30));
  const [data, setData] = useState<FinanceData>({
    balance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    categoryData: [],
    dailyData: [],
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        setLoading(true);
        const startDate = format(dateRange.from, "yyyy-MM-dd");
        const endDate = format(dateRange.to, "yyyy-MM-dd");

        // CORREÇÃO: Removido o '::integer' para garantir a compatibilidade com o ID do usuário
        // Verifique também se o nome da coluna no seu banco é 'transaction_date' ou 'calendario'
        const finances = await sql`
          SELECT * FROM finances 
          WHERE user_id = ${user.id} 
          AND transaction_date >= ${startDate} 
          AND transaction_date <= ${endDate}
          ORDER BY transaction_date DESC
        `;

        const totalIncome = finances
          .filter((f: any) => f.type === "income")
          .reduce((acc: number, f: any) => acc + Number(f.amount), 0);

        const totalExpenses = finances
          .filter((f: any) => f.type === "expense")
          .reduce((acc: number, f: any) => acc + Number(f.amount), 0);

        const balance = totalIncome - totalExpenses;

        const categoryMap = new Map<string, number>();
        finances
          .filter((f: any) => f.type === "expense")
          .forEach((f: any) => {
            const current = categoryMap.get(f.category) || 0;
            categoryMap.set(f.category, current + Number(f.amount));
          });

        const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
          name,
          value,
        }));

        const dailyMap = new Map<string, { income: number; expense: number }>();
        finances.forEach((f: any) => {
          const dateObj = new Date(f.transaction_date);
          const date = dateObj.toISOString().split('T')[0];
          
          const current = dailyMap.get(date) || { income: 0, expense: 0 };
          if (f.type === "income") current.income += Number(f.amount);
          else current.expense += Number(f.amount);
          dailyMap.set(date, current);
        });

        const dailyData = Array.from(dailyMap.entries())
          .map(([date, values]) => ({
            date,
            income: values.income,
            expense: values.expense,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setData({ balance, totalIncome, totalExpenses, categoryData, dailyData });
        setTransactions(finances);
      } catch (error) {
        console.error("Erro ao carregar finanças:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, dateRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Finanças"
        description="Gerencie seu fluxo"
        icon={<Wallet className="h-6 w-6" />}
        actions={<DateRangeSelector value={dateRange} onChange={setDateRange} />}
      />

      <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
        <MetricDisplay
          label="Saldo atual"
          value={formatCurrency(data.balance)}
          variant={data.balance >= 0 ? "health" : "default"}
          icon={<Wallet className="h-5 w-5" />}
        />
        <MetricDisplay
          label="Total de entradas"
          value={formatCurrency(data.totalIncome)}
          variant="health"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricDisplay
          label="Total de saídas"
          value={formatCurrency(data.totalExpenses)}
          variant="finance"
          icon={<TrendingDown className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
        <motion.div
          className="rounded-xl border bg-card p-4 sm:p-6 overflow-hidden" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Fluxo de Transação
          </h3>
          <div className="h-[300px] w-full"> 
             <TransactionFlowChart data={data.dailyData} />
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border bg-card p-4 sm:p-6 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <PieChart className="h-5 w-5 text-primary" />
            Gastos por categoria
          </h3>
          <div className="h-[300px] w-full">
            <CategoryPieChart data={data.categoryData} />
          </div>
        </motion.div>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Histórico</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-8 w-full sm:w-[200px]" />
              </div>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="divide-y">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma transação encontrada.</p>
            ) : (
              transactions.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-2 rounded-full shrink-0 ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {t.type === 'income' ? <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </div>
                    <div className="min-w-0"> 
                      <p className="font-medium truncate max-w-[150px] sm:max-w-none">{t.description}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t.category} • {format(new Date(t.transaction_date), "dd/MM")}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-sm sm:text-base ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}