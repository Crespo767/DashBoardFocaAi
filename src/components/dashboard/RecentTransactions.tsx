import { Link } from "react-router-dom";
import { ArrowRight, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string | null;
  category: string;
  transaction_date: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Link to="/dashboard/finances" className="block group">
        <div className="rounded-xl border bg-card p-6 shadow-sm h-full transition-all hover:shadow-md hover:border-finance/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-finance/10">
                <Receipt className="h-5 w-5 text-finance" />
              </div>
              <h3 className="font-semibold text-lg">Últimas Transações</h3>
            </div>
            <motion.div
              className="rounded-full bg-secondary p-2 opacity-0 transition-opacity group-hover:opacity-100"
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>

          {transactions.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Nenhuma transação registrada
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {tx.description || tx.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(tx.transaction_date), "dd/MM", { locale: ptBR })} • {tx.category}
                    </p>
                  </div>
                  <p className={`text-sm font-bold ml-2 ${tx.type === "income" ? "text-health" : "text-destructive"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
