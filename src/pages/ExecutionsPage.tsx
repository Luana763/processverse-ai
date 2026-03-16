import { StatusBadge } from "@/components/StatusBadge";
import { GitBranch } from "lucide-react";
import { motion } from "framer-motion";

const mockExecutions = [
  { id: "EX-001", workflow: "Reimbursement Approval", status: "completed" as const, startedBy: "Maria Silva", startedAt: "03/10/2026 10:30", duration: "12 min", steps: "5/5" },
  { id: "EX-002", workflow: "Access Provisioning", status: "running" as const, startedBy: "João Santos", startedAt: "03/10/2026 10:15", duration: "In progress", steps: "2/3" },
  { id: "EX-003", workflow: "Policy Validation", status: "error" as const, startedBy: "System", startedAt: "03/10/2026 09:45", duration: "5 min", steps: "3/4" },
  { id: "EX-004", workflow: "Document Classification", status: "completed" as const, startedBy: "AI System", startedAt: "03/10/2026 09:00", duration: "2 min", steps: "3/3" },
  { id: "EX-005", workflow: "Employee Onboarding", status: "completed" as const, startedBy: "Ana Costa", startedAt: "03/09/2026 16:30", duration: "45 min", steps: "8/8" },
  { id: "EX-006", workflow: "Anomaly Detection", status: "pending" as const, startedBy: "AI System", startedAt: "03/09/2026 15:00", duration: "Waiting", steps: "0/6" },
];

export default function ExecutionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Executions</h1>
        <p className="text-muted-foreground">Workflow execution history</p>
      </div>

      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Workflow</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">Started by</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Duration</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Steps</th>
              </tr>
            </thead>
            <tbody>
              {mockExecutions.map((exec, i) => (
                <motion.tr
                  key={exec.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 text-sm font-mono text-primary">{exec.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{exec.workflow}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={exec.status} /></td>
                  <td className="px-5 py-3 hidden md:table-cell text-sm text-muted-foreground">{exec.startedBy}</td>
                  <td className="px-5 py-3 hidden lg:table-cell text-sm text-muted-foreground">{exec.startedAt}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{exec.duration}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{exec.steps}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
