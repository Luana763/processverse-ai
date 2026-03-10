import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Configurações gerais do sistema</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-4">
          <div className="bg-card rounded-xl border shadow-card p-5 space-y-4">
            <h3 className="font-semibold">Organização</h3>
            <div className="space-y-2">
              <Label>Nome da Organização</Label>
              <Input defaultValue="FlowPulse Inc." />
            </div>
            <div className="space-y-2">
              <Label>E-mail de contato</Label>
              <Input defaultValue="admin@flowpulse.io" />
            </div>
            <Button className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow" onClick={() => toast.success("Configurações salvas!")}>
              Salvar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-4">
          <div className="bg-card rounded-xl border shadow-card p-5 space-y-4">
            <h3 className="font-semibold">Preferências de Notificação</h3>
            {[
              "Notificações por e-mail",
              "Alertas de falha de automação",
              "Resumo diário de atividades",
              "Notificações de novas tarefas",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between py-2">
                <Label>{item}</Label>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-4">
          <div className="bg-card rounded-xl border shadow-card p-5 space-y-4">
            <h3 className="font-semibold">Segurança</h3>
            <div className="flex items-center justify-between py-2">
              <Label>Autenticação de dois fatores</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label>Expiração de sessão (minutos)</Label>
              <Input className="w-24" defaultValue="60" type="number" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
