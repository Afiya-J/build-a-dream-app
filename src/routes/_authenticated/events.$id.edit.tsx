import { createFileRoute } from "@tanstack/react-router";
import { PencilLine } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/events/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit event — CampusLife" },
      { name: "description", content: "Update an event you posted on CampusLife." },
      { property: "og:title", content: "Edit event — CampusLife" },
      { property: "og:description", content: "Update an event you posted on CampusLife." },
    ],
  }),
  component: EventEditPage,
});

function EventEditPage() {
  return (
    <PlaceholderPage
      title="Edit event"
      description="Editing your own event will be available with the events module."
      icon={PencilLine}
    />
  );
}
