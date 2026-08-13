import { createFileRoute } from "@tanstack/react-router";
import { PackageOpen } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/_authenticated/sharing/$id/")({
  head: () => ({
    meta: [
      { title: "Listing details — CampusLife" },
      { name: "description", content: "View a shared academic item listing on CampusLife." },
      { property: "og:title", content: "Listing details — CampusLife" },
      { property: "og:description", content: "View a shared academic item listing on CampusLife." },
    ],
  }),
  component: ListingDetailPage,
});

function ListingDetailPage() {
  return (
    <PlaceholderPage
      title="Listing details"
      description="Image carousel, owner details and Contact Owner messaging come next."
      icon={PackageOpen}
    />
  );
}
