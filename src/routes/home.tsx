import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays, PackageOpen, Search } from "lucide-react";

import { EventPreviewCard } from "@/components/home/EventPreviewCard";
import { FeatureCard } from "@/components/home/FeatureCard";
import { QuickActionFab } from "@/components/home/QuickActionFab";
import { ResourcePreviewCard } from "@/components/home/ResourcePreviewCard";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockRecentResources, mockStudent, mockUpcomingEvents } from "@/data/mock";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — CampusLife" },
      {
        name: "description",
        content:
          "Your CampusLife dashboard: upcoming campus events, recent study resources and quick actions.",
      },
      { property: "og:title", content: "Home — CampusLife" },
      {
        property: "og:description",
        content: "Upcoming events, recent resources and quick actions for KRCT students.",
      },
    ],
  }),
  component: HomePage,
});

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function HomePage() {
  return (
    <AppShell showBrand>
      <section className="rounded-2xl bg-primary px-5 py-6 shadow-raised">
        <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
          {greeting()}
        </p>
        <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-primary-foreground">
          {mockStudent.fullName}
        </h1>
        <p className="mt-2 text-sm text-primary-foreground/80">
          {mockStudent.department} · {mockStudent.year} · {mockStudent.semester}
        </p>
      </section>

      <section aria-labelledby="features-heading" className="mt-6">
        <h2 id="features-heading" className="mb-3 text-sm font-semibold text-foreground">
          Explore
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <FeatureCard
            to="/resources"
            label="Study Resources"
            description="Notes, PYQs, videos"
            icon={BookOpen}
            accent="indigo"
          />
          <FeatureCard
            to="/sharing"
            label="Resource Sharing"
            description="Lend, sell or give"
            icon={PackageOpen}
            accent="amber"
          />
          <FeatureCard
            to="/events"
            label="Campus Events"
            description="Workshops & fests"
            icon={CalendarDays}
            accent="emerald"
          />
          <FeatureCard
            to="/lost-found"
            label="Lost & Found"
            description="Reunite lost items"
            icon={Search}
            accent="rose"
          />
        </div>
      </section>

      <section aria-labelledby="events-heading" className="mt-7">
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 id="events-heading" className="truncate text-sm font-semibold text-foreground">
            Upcoming events
          </h2>
          <Link to="/events" className="shrink-0 text-xs font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        {mockUpcomingEvents.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No upcoming events"
            description="New campus events will show up here."
          />
        ) : (
          <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
            {mockUpcomingEvents.map((event) => (
              <li key={event.id} className="snap-start">
                <EventPreviewCard event={event} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="resources-heading" className="mt-7">
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 id="resources-heading" className="truncate text-sm font-semibold text-foreground">
            Recent resources
          </h2>
          <Link
            to="/resources"
            className="shrink-0 text-xs font-semibold text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {mockRecentResources.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No resources yet"
            description="Uploaded notes and PYQs will appear here."
          />
        ) : (
          <ul className="space-y-3">
            {mockRecentResources.map((resource) => (
              <li key={resource.id}>
                <ResourcePreviewCard resource={resource} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <QuickActionFab />
    </AppShell>
  );
}
