import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
// REMOVIDO: import { supabase } ...
import { sql } from "@/lib/neon"; // ADICIONADO: Neon
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  doc_name: string;
  summary: string | null;
  tags: string;
  created_at: string;
}

interface DocumentListProps {
  documents: Document[];
  onRefresh: () => void;
}

const tagColors: Record<string, string> = {
  prova: "bg-destructive/10 text-destructive",
  trabalho: "bg-training-light text-training-dark",
  leitura: "bg-health-light text-health-dark",
  estudo: "bg-finance-light text-finance-dark",
};

const tagLabels: Record<string, string> = {
  prova: "Prova",
  trabalho: "Trabalho",
  leitura: "Leitura",
  estudo: "Estudo",
};

export function DocumentList({ documents, onRefresh }: DocumentListProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  if (documents.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-muted-foreground">
        <FileText className="mb-2 h-10 w-10" />
        <p>Nenhum documento ainda</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      // ATUALIZADO PARA NEON (SQL)
      await sql`
        DELETE FROM academic 
        WHERE id = ${id} 
        AND user_id = ${user.id}
      `;

      toast({ title: "Documento removido" });
      onRefresh();
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o documento.",
      });
    }
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group flex items-start gap-4 rounded-lg border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-academic-light">
            <FileText className="h-5 w-5 text-academic" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="truncate font-medium">{doc.doc_name}</h4>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColors[doc.tags] || "bg-gray-100 text-gray-800"}`}>
                {tagLabels[doc.tags] || doc.tags}
              </span>
            </div>
            {doc.summary && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {doc.summary}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {format(new Date(doc.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleDelete(doc.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}