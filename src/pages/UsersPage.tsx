import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Shield } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const mockUsers = [
  { id: "1", name: "Maria Silva", email: "maria@flowpulse.io", role: "Admin", status: "active" as const, org: "FlowPulse Inc." },
  { id: "2", name: "João Santos", email: "joao@flowpulse.io", role: "Operador", status: "active" as const, org: "FlowPulse Inc." },
  { id: "3", name: "Ana Costa", email: "ana@acme.com", role: "Gestor", status: "active" as const, org: "ACME Corp" },
  { id: "4", name: "Carlos Lima", email: "carlos@flowpulse.io", role: "Operador", status: "inactive" as const, org: "FlowPulse Inc." },
  { id: "5", name: "Beatriz Rocha", email: "beatriz@acme.com", role: "Visualizador", status: "active" as const, org: "ACME Corp" },
];

const colors = [
  "hsl(262, 80%, 55%)", "hsl(220, 70%, 55%)", "hsl(330, 75%, 60%)",
  "hsl(152, 60%, 45%)", "hsl(38, 92%, 55%)",
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários da plataforma</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar usuários..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Usuário</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">Organização</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Papel</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs text-primary-foreground" style={{ background: colors[i % colors.length] }}>
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-sm text-muted-foreground">{user.org}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={user.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" />Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Desativar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
