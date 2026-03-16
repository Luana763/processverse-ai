import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Plus, Search, GitBranch, Edit, Trash2, Play, Copy, MoreHorizontal,
  Eye, Power, Clock, Zap, Filter, LayoutGrid, List, ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  steps: number;
  executions: number;
  lastExecution: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  successRate: number;
}

const initialWorkflows: Workflow[] = [
  {
    id: "wf-001", name: "Reimbursement Approval",
    description: "Multi-level approval workflow for corporate reimbursements",
    status: "active", steps: 5, executions: 234, lastExecution: "2 min ago",
    createdAt: "01/15/2026", updatedAt: "03/10/2026",
    tags: ["finance", "approval"], successRate: 97.2
  },
  {
    id: "wf-002", name: "Access Provisioning",
    description: "Automatic creation of access in corporate systems via integration",
    status: "active", steps: 3, executions: 89, lastExecution: "15 min ago",
    createdAt: "01/20/2026", updatedAt: "03/09/2026",
    tags: ["IT", "automation"], successRate: 99.1
  },
  {
    id: "wf-003", name: "Employee Onboarding",
    description: "Complete onboarding process for new employees with HR, IT, and management steps",
    status: "inactive", steps: 8, executions: 45, lastExecution: "2 days ago",
    createdAt: "02/01/2026", updatedAt: "03/05/2026",
    tags: ["HR", "onboarding"], successRate: 94.5
  },
  {
    id: "wf-004", name: "Policy Validation",
    description: "Automatic validation against compliance rules and internal policies",
    status: "active", steps: 4, executions: 167, lastExecution: "30 min ago",
    createdAt: "02/10/2026", updatedAt: "03/11/2026",
    tags: ["compliance", "validation"], successRate: 98.8
  },
  {
    id: "wf-005", name: "Document Classification",
    description: "AI-powered classification of received documents for automatic categorization",
    status: "active", steps: 3, executions: 512, lastExecution: "1 min ago",
    createdAt: "02/15/2026", updatedAt: "03/11/2026",
    tags: ["AI", "documents"], successRate: 96.3
  },
  {
    id: "wf-006", name: "Anomaly Detection",
    description: "AI data analysis for financial risk and anomaly detection",
    status: "inactive", steps: 6, executions: 78, lastExecution: "1 day ago",
    createdAt: "02/25/2026", updatedAt: "03/08/2026",
    tags: ["AI", "risk"], successRate: 92.1
  },
];

export default function Workflows() {
  const [search, setSearch] = useState("");
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const navigate = useNavigate();

  const filtered = workflows.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase()) ||
      w.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
    setDeleteId(null);
    toast.success("Workflow deleted successfully");
  };

  const handleToggleStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "active" ? "inactive" as const : "active" as const }
          : w
      )
    );
    const wf = workflows.find(w => w.id === id);
    toast.success(`Workflow ${wf?.status === "active" ? "deactivated" : "activated"}`);
  };

  const handleDuplicate = (wf: Workflow) => {
    const newWf: Workflow = {
      ...wf,
      id: `wf-${Date.now()}`,
      name: `${wf.name} (Copy)`,
      status: "inactive",
      executions: 0,
      lastExecution: "Never",
      createdAt: new Date().toLocaleDateString("en-US"),
      updatedAt: new Date().toLocaleDateString("en-US"),
    };
    setWorkflows((prev) => [newWf, ...prev]);
    toast.success("Workflow duplicated successfully");
  };

  const handleExecute = (wf: Workflow) => {
    if (wf.status === "inactive") {
      toast.error("Activate the workflow before executing");
      return;
    }
    toast.success(`Execution started: ${wf.name}`);
  };

  const activeCount = workflows.filter(w => w.status === "active").length;
  const totalExecutions = workflows.reduce((s, w) => s + w.executions, 0);

  const workflowToDelete = workflows.find(w => w.id === deleteId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows and automations</p>
        </div>
        <Button
          onClick={() => navigate("/workflows/editor/new")}
          className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: workflows.length, icon: GitBranch },
          { label: "Active", value: activeCount, icon: Zap },
          { label: "Executions", value: totalExecutions.toLocaleString(), icon: Play },
          { label: "Avg. Rate", value: `${(workflows.reduce((s, w) => s + w.successRate, 0) / workflows.length).toFixed(1)}%`, icon: Clock },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border shadow-card p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg gradient-surface flex items-center justify-center">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
            <TabsList className="h-9">
              <TabsTrigger value="grid" className="px-2"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="list" className="px-2"><List className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((wf, i) => (
              <motion.div
                key={wf.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card rounded-xl border shadow-card hover:shadow-card-hover transition-all p-5 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg gradient-surface flex items-center justify-center">
                    <GitBranch className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={wf.status === "active"}
                      onCheckedChange={() => handleToggleStatus(wf.id)}
                      className="data-[state=checked]:bg-primary"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/workflows/editor/${wf.id}`)}>
                          <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/workflows/editor/${wf.id}`)}>
                          <Eye className="h-3.5 w-3.5 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExecute(wf)}>
                          <Play className="h-3.5 w-3.5 mr-2" /> Execute
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(wf)}>
                          <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(wf.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <h3
                  className="font-semibold mb-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/workflows/editor/${wf.id}`)}
                >
                  {wf.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{wf.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {wf.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" /> {wf.steps} steps
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" /> {wf.executions}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {wf.lastExecution}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Success rate</span>
                    <span className="font-medium">{wf.successRate}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-primary transition-all duration-500"
                      style={{ width: `${wf.successRate}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {viewMode === "list" && (
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_80px_80px_100px_90px_48px] gap-2 px-4 py-2.5 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Workflow</span>
            <span>Status</span>
            <span>Steps</span>
            <span>Exec.</span>
            <span>Last Exec.</span>
            <span>Success</span>
            <span></span>
          </div>
          <AnimatePresence mode="popLayout">
            {filtered.map((wf, i) => (
              <motion.div
                key={wf.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-[1fr_100px_80px_80px_100px_90px_48px] gap-2 px-4 py-3 border-b last:border-0 items-center hover:bg-muted/30 transition-colors group"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/workflows/editor/${wf.id}`)}
                >
                  <div className="h-8 w-8 rounded-lg gradient-surface flex items-center justify-center shrink-0">
                    <GitBranch className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate hover:text-primary transition-colors">{wf.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{wf.description}</p>
                  </div>
                </div>
                <div>
                  <Switch
                    checked={wf.status === "active"}
                    onCheckedChange={() => handleToggleStatus(wf.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <span className="text-sm">{wf.steps}</span>
                <span className="text-sm">{wf.executions}</span>
                <span className="text-xs text-muted-foreground">{wf.lastExecution}</span>
                <span className="text-sm font-medium">{wf.successRate}%</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/workflows/editor/${wf.id}`)}>
                      <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExecute(wf)}>
                      <Play className="h-3.5 w-3.5 mr-2" /> Execute
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(wf)}>
                      <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeleteId(wf.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <GitBranch className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No workflows found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => { setSearch(""); setStatusFilter("all"); }}
          >
            Clear filters
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{workflowToDelete?.name}</strong>?
              This action cannot be undone. All executions and history will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
