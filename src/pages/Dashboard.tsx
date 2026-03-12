import { GitBranch, PlayCircle, ListTodo, Bot, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { motion } from "framer-motion";

const recentExecutions = [
  { id: 1, workflow: "Aprovação de Reembolso", status: "completed" as const, user: "Maria Silva", date: "10 min atrás" },
  { id: 2, workflow: "Provisionamento de Acesso", status: "running" as const, user: "João Santos", date: "25 min atrás" },
  { id: 3, workflow: "Validação de Políticas", status: "error" as const, user: "Ana Costa", date: "1h atrás" },
  { id: 4, workflow: "Onboarding de Funcionário", status: "completed" as const, user: "Carlos Lima", date: "2h atrás" },
  { id: 5, workflow: "Classificação de Documentos", status: "pending" as const, user: "Sistema IA", date: "3h atrás" },
];


export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das automações e processos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Workflows Ativos" value={24} icon={GitBranch} trend={{ value: 12, positive: true }} description="vs mês anterior" gradient />
        <StatsCard title="Execuções Hoje" value={156} icon={PlayCircle} trend={{ value: 8, positive: true }} description="vs ontem" />
        <StatsCard title="Taxa de Sucesso" value="94%" icon={TrendingUp} trend={{ value: 5, positive: true }} description="vs mês anterior" />
        <StatsCard title="Automações Ativas" value={12} icon={Bot} trend={{ value: 15, positive: true }} description="workers rodando" />
      </div>

      {/* Recent Executions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border shadow-card p-5"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Execuções Recentes
        </h3>
        <div className="space-y-3">
          {recentExecutions.map((exec) => (
            <div key={exec.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg gradient-surface flex items-center justify-center shrink-0">
                  <GitBranch className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{exec.workflow}</p>
                  <p className="text-xs text-muted-foreground">{exec.user}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={exec.status} />
                <span className="text-xs text-muted-foreground hidden sm:block">{exec.date}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
