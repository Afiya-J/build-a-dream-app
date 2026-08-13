import { createFileRoute } from "@tanstack/react-router";
import { PencilLine } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/sharing/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit listing — CampusLife" },
      { name: "description", content: "Update your academic item listing on CampusLife." },
      { property: "og:title", content: "Edit listing — CampusLife" },
      { property: "og:description", content: "Update your academic item listing on CampusLife." },
    ],
  }),
  component: ListingEditPage,
});

function ListingEditPage() {
  return (
    <PlaceholderPage
      title="Edit listing"
      description="Editing your own listing will be available with the sharing module."
      icon={PencilLine}
    />
  );
}
