import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Database } from "@/integrations/supabase/types";

type FinanceCategory = Database["public"]["Enums"]["finance_category"];

const categories: FinanceCategory[] = [
  "Lazer",
  "Alimentação",
  "Despesa fixa",
  "Despesa variável",
  "Transporte",
  "Saúde",
  "Educação",
  "Investimento",
  "Outros",
];

interface AddFinanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddFinanceDialog({ open, onOpenChange, onSuccess }: AddFinanceDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState<FinanceCategory>("Outros");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("finances").insert([{
        user_id: user.id,
        type,
        category,
        amount: parseFloat(amount),
        description,
        transaction_date: date,
      }]);

      if (error) throw error;

      toast({ title: "Sucesso!", description: "Transação adicionada." });
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setType("expense");
    setCategory("Outros");
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setType("expense")}
            >
              Despesa
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setType("income")}
            >
              Receita
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Valor</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as FinanceCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              type="text"
              placeholder="Ex: Almoço, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : "Adicionar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
