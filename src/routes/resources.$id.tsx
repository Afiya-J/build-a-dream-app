import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/resources/$id")({
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
  return (
    <PlaceholderPage
      title="Resource details"
      description="Resource metadata, secure PDF preview and download counts land here."
      icon={FileText}
    />
  );
}
