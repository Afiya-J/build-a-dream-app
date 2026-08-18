import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, Eye, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatSemester, formatYear } from "@/lib/auth";
import {
  RESOURCE_MESSAGES,
  RESOURCE_TYPE_META,
  createSignedPdfUrl,
  fetchResource,
  formatUploadDate,
  registerDownload,
  registerView,
} from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/resources/$id")({
  head: () => ({
    meta: [
      { title: "Resource details — CampusLife" },
      { name: "description", content: "View details for a shared study resource on CampusLife." },
      { property: "og:title", content: "Resource details — CampusLife" },
      { property: "og:description", content: "View details for a shared study resource on CampusLife." },
    ],
  }),
  component: ResourceDetailPage,
});

function ResourceDetailPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const viewed = useRef<string | null>(null);
  const [opening, setOpening] = useState(false);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["resource", id],
    queryFn: () => fetchResource(id),
  });

  // One view per page visit, guarded against React re-renders/strict mode.
  useEffect(() => {
    if (!data || viewed.current === id) return;
    viewed.current = id;
    void registerView(id).then(() => {
      void queryClient.invalidateQueries({ queryKey: ["resource", id] });
    });
  }, [data, id, queryClient]);

  async function handleOpenPdf(download: boolean) {
    if (!data?.file_path || opening) return;
    setOpening(true);
    try {
      const signedUrl = await createSignedPdfUrl(data.file_path);
      window.open(signedUrl, "_blank", "noopener,noreferrer");
      if (download) {
        await registerDownload(id);
        await queryClient.invalidateQueries({ queryKey: ["resource", id] });
      }
    } catch {
      toast.error(RESOURCE_MESSAGES.signedUrlFailed);
    } finally {
      setOpening(false);
    }
  }

  if (isPending) {
    return (
      <AppShell title="Resource details" backTo="/resources">
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  if (isError) {
    return (
      <AppShell title="Resource details" backTo="/resources">
        <EmptyState
          icon={FileText}
          title="Something went wrong"
          description={RESOURCE_MESSAGES.detailFailed}
          action={
            <Button className="h-11" onClick={() => void refetch()}>
              Try again
            </Button>
          }
        />
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell title="Resource details" backTo="/resources">
        <EmptyState
          icon={FileText}
          title="Resource not found"
          description="This resource may have been removed."
        />
      </AppShell>
    );
  }

  const meta = RESOURCE_TYPE_META[data.type as keyof typeof RESOURCE_TYPE_META];
  const Icon = meta?.icon ?? FileText;

  return (
    <AppShell title="Resource details" backTo="/resources">
      <div className="space-y-4">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                {meta?.label ?? data.type}
              </span>
              <h1 className="mt-1.5 text-lg font-bold tracking-tight text-foreground">
                {data.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.uploader_name} · {formatUploadDate(data.created_at)}
              </p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Detail label="Subject" value={data.subject} />
            <Detail label="Department" value={data.department} />
            <Detail label="Year" value={formatYear(data.year)} />
            <Detail label="Semester" value={formatSemester(data.semester)} />
          </dl>

          {data.description ? (
            <p className="mt-4 whitespace-pre-line text-sm text-foreground">{data.description}</p>
          ) : null}

          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" aria-hidden="true" />
              {data.view_count} views
            </span>
            <span className="flex items-center gap-1">
              <Download className="size-3.5" aria-hidden="true" />
              {data.download_count} downloads
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {data.file_path ? (
              <>
                <Button className="h-11" disabled={opening} onClick={() => void handleOpenPdf(false)}>
                  {opening ? <LoadingSpinner size="sm" className="text-primary-foreground" /> : null}
                  View PDF
                </Button>
                <Button
                  variant="secondary"
                  className="h-11"
                  disabled={opening}
                  onClick={() => void handleOpenPdf(true)}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download
                </Button>
              </>
            ) : data.url ? (
              <Button asChild className="h-11">
                <a href={data.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Open link
                </a>
              </Button>
            ) : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}
