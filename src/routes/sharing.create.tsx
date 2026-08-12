import { createFileRoute } from "@tanstack/react-router";
import { PackagePlus } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/sharing/create")({
  head: () => ({
    meta: [
      { title: "List an item — CampusLife" },
      { name: "description", content: "List a lab coat, calculator, book or instrument to lend, sell or give away." },
      { property: "og:title", content: "List an item — CampusLife" },
      { property: "og:description", content: "List a lab coat, calculator, book or instrument to lend, sell or give away." },
    ],
  }),
  component: ListingCreatePage,
});

function ListingCreatePage() {
  return (
    <PlaceholderPage
      title="List an item"
      description="Item details, condition, listing type and up to three photos."
      icon={PackagePlus}
    />
  );
}
