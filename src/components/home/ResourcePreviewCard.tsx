import { Link } from "@tanstack/react-router";
import { Download, FileText, Globe, HelpCircle, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { MockResource } from "@/data/mock";
import type { ResourceType } from "@/lib/constants";

const typeIcons: Record<ResourceType, LucideIcon> = {
  Notes: FileText,
  PYQs: HelpCircle,
  Videos: Youtube,
  Websites: Globe,
};

export function ResourcePreviewCard({ resource }: { resource: MockResource }) {
  const Icon = typeIcons[resource.type];
  return (
    <Link
      to="/resources/$id"
      params={{ id: resource.id }}
      className="flex min-h-11 items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-raised"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">
          {resource.title}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {resource.subject} · {resource.uploadedBy}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <Download className="size-3.5" aria-hidden="true" />
        {resource.downloads}
      </span>
    </Link>
  );
}
