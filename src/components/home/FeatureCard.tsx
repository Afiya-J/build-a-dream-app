import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type FeatureAccent = "indigo" | "amber" | "emerald" | "rose";

const accentStyles: Record<FeatureAccent, string> = {
  indigo: "bg-primary/10 text-primary",
  amber: "bg-amber/15 text-amber-foreground",
  emerald: "bg-success/15 text-success",
  rose: "bg-danger/10 text-danger",
};

interface FeatureCardProps {
  to: "/resources" | "/sharing" | "/events" | "/lost-found";
  label: string;
  description: string;
  icon: LucideIcon;
  accent: FeatureAccent;
}

export function FeatureCard({ to, label, description, icon: Icon, accent }: FeatureCardProps) {
  return (
    <Link
      to={to}
      className="flex min-h-11 flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-raised"
    >
      <span className={cn("grid size-11 place-items-center rounded-xl", accentStyles[accent])}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
      </span>
    </Link>
  );
}
