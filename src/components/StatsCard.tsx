import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  gradient?: boolean;
}

export function StatsCard({ title, value, description, icon: Icon, trend, gradient }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-300 ${
        gradient ? "gradient-primary text-primary-foreground" : "bg-card border"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-medium ${gradient ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          {title}
        </span>
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
          gradient ? "bg-primary-foreground/20" : "gradient-surface"
        }`}>
          <Icon className={`h-4 w-4 ${gradient ? "text-primary-foreground" : "text-primary"}`} />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="flex items-center gap-2">
        {trend && (
          <span className={`text-xs font-medium ${
            trend.positive
              ? gradient ? "text-primary-foreground/90" : "text-success"
              : "text-destructive"
          }`}>
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
        )}
        {description && (
          <span className={`text-xs ${gradient ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {description}
          </span>
        )}
      </div>
    </motion.div>
  );
}
