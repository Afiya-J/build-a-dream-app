import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/events/saved")({
  head: () => ({
    meta: [
      { title: "Saved Events — CampusLife" },
      { name: "description", content: "Your bookmarked KRCT campus events and their registration deadlines." },
      { property: "og:title", content: "Saved Events — CampusLife" },
      { property: "og:description", content: "Your bookmarked KRCT campus events and their registration deadlines." },
    ],
  }),
  component: SavedEventsPage,
});

function SavedEventsPage() {
  return (
    <PlaceholderPage
      title="Saved Events"
      description="Bookmarked events and deadline reminders will appear here."
      icon={Bookmark}
    />
  );
}
