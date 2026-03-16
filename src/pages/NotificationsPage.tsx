import { Bell, CheckCheck, GitBranch, AlertTriangle, UserPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  description: string;
  type: "workflow" | "alert" | "user" | "system";
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, title: "Workflow completed", description: "Reimbursement Approval #1247 was successfully completed", type: "workflow", time: "5 min ago", read: false },
  { id: 2, title: "Automation failure", description: "AI Worker encountered an error processing a document", type: "alert", time: "15 min ago", read: false },
  { id: 3, title: "New user created", description: "Beatriz Rocha was added to ACME Corp organization", type: "user", time: "1h ago", read: false },
  { id: 4, title: "Task assigned", description: "You have a new pending task: Validate fiscal document INV-3891", type: "workflow", time: "2h ago", read: true },
  { id: 5, title: "System update", description: "New FlowPulse version available with performance improvements", type: "system", time: "1 day ago", read: true },
];

const iconMap = {
  workflow: GitBranch,
  alert: AlertTriangle,
  user: UserPlus,
  system: FileText,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">{notifications.filter((n) => !n.read).length} unread</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheck className="h-3.5 w-3.5 mr-1" />
          Mark all as read
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif, i) => {
          const Icon = iconMap[notif.type];
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => markRead(notif.id)}
              className={`bg-card rounded-xl border p-4 cursor-pointer transition-all hover:shadow-card-hover ${
                !notif.read ? "border-primary/30 shadow-card" : "opacity-70"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                  !notif.read ? "gradient-primary shadow-glow" : "bg-muted"
                }`}>
                  <Icon className={`h-4 w-4 ${!notif.read ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{notif.title}</h3>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{notif.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{notif.description}</p>
                </div>
                {!notif.read && <div className="h-2 w-2 rounded-full gradient-accent shrink-0 mt-2" />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
