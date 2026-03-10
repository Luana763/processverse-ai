import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const mockTasks = [
  { id: 1, title: "Aprovar reembolso de viagem #1247", workflow: "Aprovação de Reembolso", assignee: "Admin User", priority: "Alta", status: "pending" as const, date: "Hoje, 10:30", details: "Valor: R$ 2.450,00" },
  { id: 2, title: "Revisar acesso ao sistema CRM", workflow: "Provisionamento de Acesso", assignee: "Admin User", priority: "Média", status: "pending" as const, date: "Hoje, 09:15", details: "Solicitante: João Santos" },
  { id: 3, title: "Validar documento fiscal NF-3891", workflow: "Validação de Políticas", assignee: "Admin User", priority: "Alta", status: "pending" as const, date: "Ontem, 16:45", details: "Tipo: Nota Fiscal" },
  { id: 4, title: "Confirmar onboarding de funcionário", workflow: "Onboarding", assignee: "Maria Silva", priority: "Baixa", status: "completed" as const, date: "Ontem, 14:00", details: "Funcionário: Carlos Lima" },
  { id: 5, title: "Aprovar classificação de documento", workflow: "Classificação IA", assignee: "Admin User", priority: "Média", status: "pending" as const, date: "Ontem, 11:30", details: "Confiança IA: 87%" },
];

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tarefas Pendentes</h1>
        <p className="text-muted-foreground">Tarefas que aguardam sua ação</p>
      </div>

      <div className="space-y-3">
        {mockTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border shadow-card p-5 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{task.title}</h3>
                  <StatusBadge status={task.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{task.workflow}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{task.date}</span>
                  <span>{task.details}</span>
                </div>
              </div>
              {task.status === "pending" && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm"><Eye className="h-3.5 w-3.5 mr-1" />Detalhes</Button>
                  <Button
                    size="sm"
                    className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow"
                    onClick={() => toast.success("Tarefa aprovada!")}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />Aprovar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast.error("Tarefa rejeitada")}>
                    <XCircle className="h-3.5 w-3.5 mr-1" />Rejeitar
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
