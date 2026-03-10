import { StatusBadge } from "@/components/StatusBadge";
import { Bot, Activity, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const mockAutomations = [
  { id: "W-001", name: "Worker de Emails", status: "active" as const, lastRun: "5 min atrás", tasksProcessed: 1247, errorRate: "0.5%", uptime: "99.8%" },
  { id: "W-002", name: "Worker de Documentos", status: "active" as const, lastRun: "2 min atrás", tasksProcessed: 856, errorRate: "1.2%", uptime: "99.5%" },
  { id: "W-003", name: "Worker de Integrações", status: "active" as const, lastRun: "8 min atrás", tasksProcessed: 2341, errorRate: "0.3%", uptime: "99.9%" },
  { id: "W-004", name: "Worker de IA", status: "inactive" as const, lastRun: "1h atrás", tasksProcessed: 432, errorRate: "2.1%", uptime: "98.5%" },
];

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Monitoramento de Automações</h1>
        <p className="text-muted-foreground">Status dos workers e automações</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAutomations.map((auto, i) => (
          <motion.div
            key={auto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border shadow-card p-5 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">{auto.name}</h3>
                  <p className="text-xs text-muted-foreground">{auto.id}</p>
                </div>
              </div>
              <StatusBadge status={auto.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Activity className="h-3 w-3" />
                  Tarefas
                </div>
                <p className="text-sm font-semibold">{auto.tasksProcessed.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Clock className="h-3 w-3" />
                  Última execução
                </div>
                <p className="text-sm font-semibold">{auto.lastRun}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <AlertTriangle className="h-3 w-3" />
                  Taxa de erro
                </div>
                <p className="text-sm font-semibold">{auto.errorRate}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <CheckCircle className="h-3 w-3" />
                  Uptime
                </div>
                <p className="text-sm font-semibold">{auto.uptime}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
