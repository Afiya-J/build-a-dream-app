import { Link } from "@tanstack/react-router";
import { Download, Eye } from "lucide-react";

import { RESOURCE_TYPE_META, formatUploadDate } from "@/lib/resources";
import type { ResourceWithUploader } from "@/lib/resources";

export function ResourceCard({ resource }: { resource: ResourceWithUploader }) {
  const meta = RESOURCE_TYPE_META[resource.type as keyof typeof RESOURCE_TYPE_META];
  const Icon = meta?.icon ?? Download;

  return (
    <Link
      to="/resources/$id"
      params={{ id: resource.id }}
      className="flex min-h-11 items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-raised"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            {meta?.label ?? resource.type}
          </span>
          <span className="truncate text-xs text-muted-foreground">{resource.subject}</span>
        </span>
        <span className="mt-1 block truncate text-sm font-semibold text-foreground">
          {resource.title}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {resource.uploader_name} · {formatUploadDate(resource.created_at)}
        </span>
        <span className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" aria-hidden="true" />
            {resource.view_count}
          </span>
          <span className="flex items-center gap-1">
            <Download className="size-3.5" aria-hidden="true" />
            {resource.download_count}
          </span>
        </span>
      </span>
    </Link>
  );
}
