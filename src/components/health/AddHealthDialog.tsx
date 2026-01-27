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

const categories = [
  { value: "Agua", label: "Água (ml)", icon: "💧" },
  { value: "Sono", label: "Sono (horas)", icon: "😴" },
  { value: "Peso", label: "Peso (kg)", icon: "⚖️" },
  { value: "Treino", label: "Treino", icon: "💪" },
];

interface AddHealthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddHealthDialog({ open, onOpenChange, onSuccess }: AddHealthDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<"Agua" | "Sono" | "Peso" | "Treino">("Agua");
  const [value, setValue] = useState("");
  const [item, setItem] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("health").insert([{
        user_id: user.id,
        category,
        value: parseFloat(value) || 0,
        item: category === "Treino" ? item : null,
        calendario: new Date(date).toISOString(),
      }]);

      if (error) throw error;

      toast({ title: "Sucesso!", description: "Registro adicionado." });
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
    setCategory("Agua");
    setValue("");
    setItem("");
    setDate(new Date().toISOString().slice(0, 16));
  };

  const getPlaceholder = () => {
    switch (category) {
      case "Agua":
        return "Ex: 250";
      case "Sono":
        return "Ex: 8";
      case "Peso":
        return "Ex: 70.5";
      case "Treino":
        return "Duração (min)";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo registro de saúde</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v: typeof category) => setCategory(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Valor</Label>
            <Input
              type="number"
              step="0.1"
              placeholder={getPlaceholder()}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          {category === "Treino" && (
            <div className="space-y-2">
              <Label>Tipo de treino</Label>
              <Input
                type="text"
                placeholder="Ex: Musculação, Corrida..."
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Data e hora</Label>
            <Input
              type="datetime-local"
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
