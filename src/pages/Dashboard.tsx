import { GitBranch, PlayCircle, Bot, TrendingUp, Clock } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { motion } from "framer-motion";

const recentExecutions = [
  { id: 1, workflow: "Reimbursement Approval", status: "completed" as const, user: "Maria Silva", date: "10 min ago" },
  { id: 2, workflow: "Access Provisioning", status: "running" as const, user: "João Santos", date: "25 min ago" },
  { id: 3, workflow: "Policy Validation", status: "error" as const, user: "Ana Costa", date: "1h ago" },
  { id: 4, workflow: "Employee Onboarding", status: "completed" as const, user: "Carlos Lima", date: "2h ago" },
  { id: 5, workflow: "Document Classification", status: "pending" as const, user: "AI System", date: "3h ago" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of automations and processes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Workflows" value={24} icon={GitBranch} trend={{ value: 12, positive: true }} description="vs last month" gradient />
        <StatsCard title="Executions Today" value={156} icon={PlayCircle} trend={{ value: 8, positive: true }} description="vs yesterday" />
        <StatsCard title="Success Rate" value="94%" icon={TrendingUp} trend={{ value: 5, positive: true }} description="vs last month" />
        <StatsCard title="Active Automations" value={12} icon={Bot} trend={{ value: 15, positive: true }} description="workers running" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border shadow-card p-5"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Recent Executions
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
