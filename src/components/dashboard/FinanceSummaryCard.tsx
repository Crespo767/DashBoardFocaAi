import { Link } from "react-router-dom";
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FinanceSummaryCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export function FinanceSummaryCard({ balance, income, expenses }: FinanceSummaryCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const isPositive = balance >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link to="/dashboard/finances" className="block group">
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-finance/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-finance/10">
                <Wallet className="h-6 w-6 text-finance" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Resumo Financeiro</h3>
                <p className="text-sm text-muted-foreground">Visão do período</p>
              </div>
            </div>
            <motion.div
              className="rounded-full bg-secondary p-2 opacity-0 transition-opacity group-hover:opacity-100"
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>

          {/* Balance */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-finance/10 to-finance/5 border border-finance/20">
            <p className="text-sm text-muted-foreground mb-1">Saldo atual</p>
            <p className={`text-3xl font-bold ${isPositive ? "text-health" : "text-destructive"}`}>
              {formatCurrency(balance)}
            </p>
          </div>

          {/* Income & Expenses */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-health/10 border border-health/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-health" />
                <span className="text-sm text-muted-foreground">Receitas</span>
              </div>
              <p className="text-xl font-bold text-health">{formatCurrency(income)}</p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <span className="text-sm text-muted-foreground">Despesas</span>
              </div>
              <p className="text-xl font-bold text-destructive">{formatCurrency(expenses)}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
