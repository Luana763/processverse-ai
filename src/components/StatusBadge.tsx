import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "active" | "inactive" | "pending" | "completed" | "error" | "running";

const statusStyles: Record<Status, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-muted",
  pending: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-success/10 text-success border-success/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  running: "bg-info/10 text-info border-info/20",
};

const statusLabels: Record<Status, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  completed: "Completed",
  error: "Error",
  running: "Running",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", statusStyles[status])}>
      {statusLabels[status]}
    </Badge>
  );
}
