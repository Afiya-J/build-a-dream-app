import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/_authenticated/events/")({
  head: () => ({
    meta: [
      { title: "Campus Events — CampusLife" },
      { name: "description", content: "Discover workshops, hackathons, competitions, cultural nights and seminars at KRCT." },
      { property: "og:title", content: "Campus Events — CampusLife" },
      { property: "og:description", content: "Discover workshops, hackathons, competitions, cultural nights and seminars at KRCT." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <PlaceholderPage
      title="Campus Events"
      description="Upcoming workshops, hackathons, competitions and cultural events."
      icon={CalendarDays}
    />
  );
}
