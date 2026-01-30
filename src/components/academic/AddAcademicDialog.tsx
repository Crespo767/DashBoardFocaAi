import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { sql } from "@/lib/neon"; // Tudo no Neon!
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const tags = [
  { value: "estudo", label: "Sessão de Estudo", emoji: "📚" },
  { value: "prova", label: "Prova / Avaliação", emoji: "📝" },
  { value: "trabalho", label: "Trabalho / Entrega", emoji: "📊" },
  { value: "leitura", label: "Leitura", emoji: "📖" },
];

interface AddAcademicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddAcademicDialog({ open, onOpenChange, onSuccess }: AddAcademicDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [activityName, setActivityName] = useState("");
  const [details, setDetails] = useState("");
  const [tag, setTag] = useState<string>("estudo");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Usando created_at como a "Data da Atividade" para simplificar o schema existente.
      // Se você tiver uma coluna 'date' específica no banco, altere aqui.
      const activityDate = date ? new Date(date).toISOString() : new Date().toISOString();

      await sql`
        INSERT INTO academic (user_id, doc_name, summary, tags, created_at)
        VALUES (
          ${user.id}::integer, 
          ${activityName}, 
          ${details || null}, 
          ${tag}, 
          ${activityDate}
        )
      `;

      toast({ title: "Sucesso!", description: "Atividade registrada." });
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a atividade.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActivityName("");
    setDetails("");
    setTag("estudo");
    setDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Atividade Acadêmica</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>O que você vai fazer?</Label>
            <Input
              type="text"
              placeholder="Ex: Estudar Matemática, Prova de História..."
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.emoji} {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data/Hora</Label>
              <Input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações (Opcional)</Label>
            <Textarea
              placeholder="Conteúdo a ser estudado, capítulos, notas..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : "Agendar Atividade"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}