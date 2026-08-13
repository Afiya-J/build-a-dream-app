import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/lost-found/")({
  head: () => ({
    meta: [
      { title: "Lost & Found — CampusLife" },
      { name: "description", content: "Browse items found around the KRCT campus and claim what belongs to you." },
      { property: "og:title", content: "Lost & Found — CampusLife" },
      { property: "og:description", content: "Browse items found around the KRCT campus and claim what belongs to you." },
    ],
  }),
  component: LostFoundPage,
});

function LostFoundPage() {
  return (
    <PlaceholderPage
      title="Lost & Found"
      description="Items found around campus, with active and returned filters."
      icon={Search}
    />
  );
}
