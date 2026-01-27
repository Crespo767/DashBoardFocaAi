import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const tags = [
  { value: "prova", label: "Prova", emoji: "📝" },
  { value: "trabalho", label: "Trabalho", emoji: "📊" },
  { value: "leitura", label: "Leitura", emoji: "📖" },
  { value: "estudo", label: "Estudo", emoji: "📚" },
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
  const [docName, setDocName] = useState("");
  const [summary, setSummary] = useState("");
  const [tag, setTag] = useState<"prova" | "trabalho" | "leitura" | "estudo">("estudo");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("academic").insert([{
        user_id: user.id,
        doc_name: docName,
        summary: summary || null,
        tags: tag,
      }]);

      if (error) throw error;

      toast({ title: "Sucesso!", description: "Documento adicionado." });
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
    setDocName("");
    setSummary("");
    setTag("estudo");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo documento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome do documento</Label>
            <Input
              type="text"
              placeholder="Ex: Prova de Cálculo I"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={tag} onValueChange={(v: typeof tag) => setTag(v)}>
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
            <Label>Resumo (opcional)</Label>
            <Textarea
              placeholder="Adicione um resumo ou notas importantes..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
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
