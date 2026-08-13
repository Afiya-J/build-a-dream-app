import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/_authenticated/events/$id/")({
  head: () => ({
    meta: [
      { title: "Event details — CampusLife" },
      { name: "description", content: "View full details and registration info for a KRCT campus event." },
      { property: "og:title", content: "Event details — CampusLife" },
      { property: "og:description", content: "View full details and registration info for a KRCT campus event." },
    ],
  }),
  component: EventDetailPage,
});

function EventDetailPage() {
  return (
    <PlaceholderPage
      title="Event details"
      description="Full event info, deadline countdown and registration links come next."
      icon={CalendarDays}
    />
  );
}
