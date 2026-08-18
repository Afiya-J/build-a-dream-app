import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Upload } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { DEPARTMENTS, SEMESTERS_BY_YEAR, YEARS } from "@/lib/constants";
import type { Year } from "@/lib/constants";
import {
  RESOURCE_MESSAGES,
  TYPE_FILTERS,
  fetchResources,
  fetchSubjects,
} from "@/lib/resources";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/stores/filter-store";

export const Route = createFileRoute("/_authenticated/resources/")({
  head: () => ({
    meta: [
      { title: "Study Resources — CampusLife" },
      { name: "description", content: "Browse handwritten notes, previous year question papers, videos and websites shared by KRCT students." },
      { property: "og:title", content: "Study Resources — CampusLife" },
      { property: "og:description", content: "Browse handwritten notes, previous year question papers, videos and websites shared by KRCT students." },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const { profile } = useAuth();
  const collegeId = profile?.college_id ?? null;

  const { department, year, semester, subject, resourceType, setFilter, resetFilters } =
    useFilterStore();

  const semesterOptions = year ? (SEMESTERS_BY_YEAR[year as Year] ?? []) : [];

  const subjectsQuery = useQuery({
    queryKey: ["resource-subjects", collegeId, department, year, semester],
    enabled: Boolean(collegeId) && Boolean(department) && Boolean(year) && Boolean(semester),
    queryFn: () => fetchSubjects(collegeId!, department, year, semester),
  });

  const resourcesQuery = useQuery({
    queryKey: ["resources", collegeId, department, year, semester, subject, resourceType],
    enabled: Boolean(collegeId),
    queryFn: () =>
      fetchResources({
        collegeId: collegeId!,
        department,
        year,
        semester,
        subject,
        type: resourceType,
      }),
  });

  const subjectEnabled = Boolean(department && year && semester);
  const hasFilters = Boolean(department || year || semester || subject) || resourceType !== "All";

  return (
    <AppShell title="Study Resources">
      <div className="space-y-4">
        <section className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={department ?? ""}
              onValueChange={(v) => setFilter({ department: v, subject: null })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={year ?? ""}
              onValueChange={(v) => setFilter({ year: v, semester: null, subject: null })}
              disabled={!department}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={semester ?? ""}
              onValueChange={(v) => setFilter({ semester: v, subject: null })}
              disabled={!year}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesterOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={subject ?? ""}
              onValueChange={(v) => setFilter({ subject: v })}
              disabled={!subjectEnabled || (subjectsQuery.data?.length ?? 0) === 0}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {(subjectsQuery.data ?? []).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter({ resourceType: value })}
                className={cn(
                  "min-h-9 rounded-full px-3.5 text-xs font-medium transition-colors",
                  resourceType === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-secondary-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          ) : null}
        </section>

        {resourcesQuery.isPending ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : resourcesQuery.isError ? (
          <EmptyState
            icon={BookOpen}
            title="Something went wrong"
            description={RESOURCE_MESSAGES.loadFailed}
            action={
              <Button onClick={() => void resourcesQuery.refetch()} className="h-11">
                Try again
              </Button>
            }
          />
        ) : (resourcesQuery.data?.length ?? 0) === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No resources yet"
            description="Nothing matches these filters. Be the first to share notes, question papers or useful links."
            action={
              <Button asChild className="h-11">
                <Link to="/resources/upload">
                  <Upload className="size-4" aria-hidden="true" />
                  Upload a resource
                </Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {resourcesQuery.data!.map((resource) => (
              <li key={resource.id}>
                <ResourceCard resource={resource} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
