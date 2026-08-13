import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/lost-found/$id")({
  head: () => ({
    meta: [
      { title: "Found item details — CampusLife" },
      { name: "description", content: "View details of an item found on the KRCT campus." },
      { property: "og:title", content: "Found item details — CampusLife" },
      { property: "og:description", content: "View details of an item found on the KRCT campus." },
    ],
  }),
  component: LostFoundDetailPage,
});

function LostFoundDetailPage() {
  return (
    <PlaceholderPage
      title="Found item details"
      description="Item photos, where it was found and the This is Mine flow."
      icon={Search}
    />
  );
}
