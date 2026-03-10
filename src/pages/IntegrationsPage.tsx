import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Plug, Key, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const mockIntegrations = [
  { id: "1", name: "SAP ERP", type: "REST API", status: "active" as const, lastSync: "5 min atrás", credentials: true },
  { id: "2", name: "Salesforce CRM", type: "OAuth 2.0", status: "active" as const, lastSync: "10 min atrás", credentials: true },
  { id: "3", name: "Azure AD", type: "SAML", status: "active" as const, lastSync: "15 min atrás", credentials: true },
  { id: "4", name: "Google Workspace", type: "OAuth 2.0", status: "inactive" as const, lastSync: "2 dias atrás", credentials: false },
  { id: "5", name: "Slack", type: "Webhook", status: "active" as const, lastSync: "1 min atrás", credentials: true },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Integrações</h1>
          <p className="text-muted-foreground">Configure conexões com sistemas externos</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow">
          <Plus className="h-4 w-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockIntegrations.map((integ, i) => (
          <motion.div
            key={integ.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border shadow-card p-5 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg gradient-surface flex items-center justify-center">
                <Plug className="h-5 w-5 text-primary" />
              </div>
              <StatusBadge status={integ.status} />
            </div>
            <h3 className="font-semibold mb-1">{integ.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{integ.type}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Sync: {integ.lastSync}</span>
              <div className="flex items-center gap-1">
                <Key className="h-3 w-3" />
                <span>{integ.credentials ? "Configurado" : "Pendente"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
