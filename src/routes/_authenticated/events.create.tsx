import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/events/create")({
  head: () => ({
    meta: [
      { title: "Post an event — CampusLife" },
      { name: "description", content: "Publish a workshop, hackathon or cultural event for KRCT students." },
      { property: "og:title", content: "Post an event — CampusLife" },
      { property: "og:description", content: "Publish a workshop, hackathon or cultural event for KRCT students." },
    ],
  }),
  component: EventCreatePage,
});

function EventCreatePage() {
  return (
    <PlaceholderPage
      title="Post an event"
      description="Event details, venue, deadlines and poster upload."
      icon={CalendarPlus}
    />
  );
}
