import { FileText, User, Clock, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

const mockLogs = [
  { id: 1, user: "Maria Silva", action: "Aprovou tarefa #1245", entity: "Workflow: Reembolso", date: "10/03/2026 10:30:15", ip: "192.168.1.10" },
  { id: 2, user: "João Santos", action: "Iniciou execução do workflow", entity: "Workflow: Provisionamento", date: "10/03/2026 10:15:22", ip: "192.168.1.25" },
  { id: 3, user: "Admin User", action: "Criou novo usuário", entity: "Usuário: Beatriz Rocha", date: "10/03/2026 09:45:08", ip: "192.168.1.1" },
  { id: 4, user: "Sistema", action: "Worker falhou na execução", entity: "Automação: Worker de IA", date: "10/03/2026 09:30:00", ip: "interno" },
  { id: 5, user: "Ana Costa", action: "Upload de documento", entity: "Arquivo: relatorio_q1.pdf", date: "10/03/2026 09:00:33", ip: "192.168.2.15" },
  { id: 6, user: "Admin User", action: "Alterou papel de usuário", entity: "Usuário: Carlos Lima", date: "09/03/2026 16:45:12", ip: "192.168.1.1" },
  { id: 7, user: "Sistema IA", action: "Classificou documento", entity: "Documento: NF-3891", date: "09/03/2026 15:20:00", ip: "interno" },
  { id: 8, user: "Maria Silva", action: "Rejeitou tarefa #1240", entity: "Workflow: Validação", date: "09/03/2026 14:10:45", ip: "192.168.1.10" },
];

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const filtered = mockLogs.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Auditoria</h1>
        <p className="text-muted-foreground">Log de ações do sistema</p>
      </div>

      <div className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Filtrar logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Data</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Usuário</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Ação</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">Entidade</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden lg:table-cell">IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">{log.date}</td>
                  <td className="px-5 py-3 text-sm font-medium">{log.user}</td>
                  <td className="px-5 py-3 text-sm">{log.action}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground hidden md:table-cell">{log.entity}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground font-mono hidden lg:table-cell">{log.ip}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
