import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, Users, Edit } from "lucide-react";
import { motion } from "framer-motion";

const mockRoles = [
  { id: "1", name: "Admin", description: "Acesso total ao sistema", users: 2, permissions: ["Gerenciar usuários", "Gerenciar workflows", "Gerenciar papéis", "Auditoria", "Configurações"] },
  { id: "2", name: "Gestor", description: "Gerencia workflows e aprova tarefas", users: 5, permissions: ["Criar workflows", "Aprovar tarefas", "Visualizar relatórios"] },
  { id: "3", name: "Operador", description: "Executa e monitora workflows", users: 12, permissions: ["Executar workflows", "Visualizar tarefas", "Upload de arquivos"] },
  { id: "4", name: "Visualizador", description: "Acesso somente leitura", users: 8, permissions: ["Visualizar workflows", "Visualizar execuções"] },
];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Papéis</h1>
          <p className="text-muted-foreground">Gerencie papéis e permissões</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow">
          <Plus className="h-4 w-4 mr-2" />
          Novo Papel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRoles.map((role, i) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border shadow-card p-5 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg gradient-surface flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{role.name}</h3>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{role.users} usuários</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {role.permissions.map((perm) => (
                <Badge key={perm} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                  {perm}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
