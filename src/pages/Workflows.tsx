import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Search, GitBranch, Edit, Trash2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const mockWorkflows = [
  { id: "1", name: "Aprovação de Reembolso", description: "Workflow de aprovação com múltiplos níveis", status: "active" as const, steps: 5, executions: 234 },
  { id: "2", name: "Provisionamento de Acesso", description: "Criação automática de acessos em sistemas", status: "active" as const, steps: 3, executions: 89 },
  { id: "3", name: "Onboarding de Funcionário", description: "Processo completo de integração", status: "inactive" as const, steps: 8, executions: 45 },
  { id: "4", name: "Validação de Políticas", description: "Validação automática contra regras de compliance", status: "active" as const, steps: 4, executions: 167 },
  { id: "5", name: "Classificação de Documentos", description: "Classificação com IA de documentos recebidos", status: "active" as const, steps: 3, executions: 512 },
  { id: "6", name: "Detecção de Anomalias", description: "Análise de dados com IA para detecção de riscos", status: "inactive" as const, steps: 6, executions: 78 },
];

export default function Workflows() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = mockWorkflows.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Gerencie seus fluxos de trabalho</p>
        </div>
        <Button onClick={() => navigate("/workflows/editor")} className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow">
          <Plus className="h-4 w-4 mr-2" />
          Novo Workflow
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar workflows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((wf, i) => (
          <motion.div
            key={wf.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border shadow-card hover:shadow-card-hover transition-shadow p-5 group cursor-pointer"
            onClick={() => navigate("/workflows/editor")}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg gradient-surface flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <StatusBadge status={wf.status} />
            </div>
            <h3 className="font-semibold mb-1">{wf.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{wf.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{wf.steps} etapas</span>
                <span>{wf.executions} execuções</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); }}>
                  <Play className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); }}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
