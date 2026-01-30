import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2, BookOpen, GraduationCap, FileText, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { sql } from "@/lib/neon";
import { useToast } from "@/hooks/use-toast";

interface AcademicItem {
  id: string;
  doc_name: string; // Usado como Título da Atividade
  summary: string | null;
  tags: string;
  created_at: string; // Usado como Data da Atividade
}

interface AcademicListProps {
  items: AcademicItem[];
  onRefresh: () => void;
}

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  prova: { 
    label: "Prova", 
    color: "text-red-600", 
    bg: "bg-red-100", 
    icon: FileText 
  },
  trabalho: { 
    label: "Trabalho", 
    color: "text-orange-600", 
    bg: "bg-orange-100", 
    icon: CalendarCheck 
  },
  leitura: { 
    label: "Leitura", 
    color: "text-blue-600", 
    bg: "bg-blue-100", 
    icon: BookOpen 
  },
  estudo: { 
    label: "Estudo", 
    color: "text-green-600", 
    bg: "bg-green-100", 
    icon: GraduationCap 
  },
  default: {
    label: "Atividade", 
    color: "text-gray-600", 
    bg: "bg-gray-100", 
    icon: BookOpen
  }
};

export function AcademicList({ items, onRefresh }: AcademicListProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  if (items.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
        <GraduationCap className="mb-2 h-10 w-10 opacity-20" />
        <p>Nenhuma atividade registrada</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await sql`
        DELETE FROM academic 
        WHERE id = ${id} 
        AND user_id = ${user.id}::integer
      `;
      toast({ title: "Atividade removida" });
      onRefresh();
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover.",
      });
    }
  };

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {items.map((item) => {
        const config = typeConfig[item.tags] || typeConfig.default;
        const Icon = config.icon;
        const date = new Date(item.created_at);
        const isFuture = date > new Date();

        return (
          <div
            key={item.id}
            className="group flex items-start gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-sm"
          >
            {/* Ícone do Tipo */}
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
              <Icon className={`h-6 w-6 ${config.color}`} />
            </div>

            {/* Conteúdo */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="truncate font-semibold text-foreground">{item.doc_name}</h4>
                {isFuture && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Agendado
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${config.bg} ${config.color}`}>
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(date, "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>

              {item.summary && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 bg-secondary/50 p-2 rounded-lg">
                  {item.summary}
                </p>
              )}
            </div>

            {/* Ações */}
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}