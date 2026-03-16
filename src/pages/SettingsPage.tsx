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
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">General system settings</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-4">
          <div className="bg-card rounded-xl border shadow-card p-5 space-y-4">
            <h3 className="font-semibold">Organization</h3>
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input defaultValue="FlowPulse Inc." />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input defaultValue="admin@flowpulse.io" />
            </div>
            <Button className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow" onClick={() => toast.success("Settings saved!")}>
              Save
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-4">
          <div className="bg-card rounded-xl border shadow-card p-5 space-y-4">
            <h3 className="font-semibold">Notification Preferences</h3>
            {[
              "Email notifications",
              "Automation failure alerts",
              "Daily activity summary",
              "New task notifications",
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
            <h3 className="font-semibold">Security</h3>
            <div className="flex items-center justify-between py-2">
              <Label>Two-factor authentication</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label>Session expiration (minutes)</Label>
              <Input className="w-24" defaultValue="60" type="number" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
