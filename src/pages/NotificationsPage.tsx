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
  { id: 1, title: "Workflow concluído", description: "Aprovação de Reembolso #1247 foi finalizado com sucesso", type: "workflow", time: "5 min atrás", read: false },
  { id: 2, title: "Falha na automação", description: "Worker de IA encontrou erro ao processar documento", type: "alert", time: "15 min atrás", read: false },
  { id: 3, title: "Novo usuário criado", description: "Beatriz Rocha foi adicionada à organização ACME Corp", type: "user", time: "1h atrás", read: false },
  { id: 4, title: "Tarefa atribuída", description: "Você tem uma nova tarefa pendente: Validar documento fiscal NF-3891", type: "workflow", time: "2h atrás", read: true },
  { id: 5, title: "Atualização do sistema", description: "Nova versão do FlowPulse disponível com melhorias de performance", type: "system", time: "1 dia atrás", read: true },
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
    toast.success("Todas notificações marcadas como lidas");
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">{notifications.filter((n) => !n.read).length} não lidas</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheck className="h-3.5 w-3.5 mr-1" />
          Marcar todas como lidas
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
