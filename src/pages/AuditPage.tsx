import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

const mockLogs = [
  { id: 1, user: "Maria Silva", action: "Approved task #1245", entity: "Workflow: Reimbursement", date: "03/10/2026 10:30:15", ip: "192.168.1.10" },
  { id: 2, user: "João Santos", action: "Started workflow execution", entity: "Workflow: Provisioning", date: "03/10/2026 10:15:22", ip: "192.168.1.25" },
  { id: 3, user: "Admin User", action: "Created new user", entity: "User: Beatriz Rocha", date: "03/10/2026 09:45:08", ip: "192.168.1.1" },
  { id: 4, user: "System", action: "Worker execution failed", entity: "Automation: AI Worker", date: "03/10/2026 09:30:00", ip: "internal" },
  { id: 5, user: "Ana Costa", action: "Uploaded document", entity: "File: report_q1.pdf", date: "03/10/2026 09:00:33", ip: "192.168.2.15" },
  { id: 6, user: "Admin User", action: "Changed user role", entity: "User: Carlos Lima", date: "03/09/2026 16:45:12", ip: "192.168.1.1" },
  { id: 7, user: "AI System", action: "Classified document", entity: "Document: INV-3891", date: "03/09/2026 15:20:00", ip: "internal" },
  { id: 8, user: "Maria Silva", action: "Rejected task #1240", entity: "Workflow: Validation", date: "03/09/2026 14:10:45", ip: "192.168.1.10" },
];

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const filtered = mockLogs.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit</h1>
        <p className="text-muted-foreground">System action log</p>
      </div>

      <div className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Filter logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">User</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Action</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">Entity</th>
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
