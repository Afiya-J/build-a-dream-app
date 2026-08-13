import { createFileRoute } from "@tanstack/react-router";
import { PackagePlus } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/_authenticated/lost-found/create")({
  head: () => ({
    meta: [
      { title: "Post a found item — CampusLife" },
      { name: "description", content: "Report an item you found on campus so its owner can claim it." },
      { property: "og:title", content: "Post a found item — CampusLife" },
      { property: "og:description", content: "Report an item you found on campus so its owner can claim it." },
    ],
  }),
  component: LostFoundCreatePage,
});

function LostFoundCreatePage() {
  return (
    <PlaceholderPage
      title="Post a found item"
      description="Item details, location, date found and up to three photos."
      icon={PackagePlus}
    />
  );
}
