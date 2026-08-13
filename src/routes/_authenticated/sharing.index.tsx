import { createFileRoute } from "@tanstack/react-router";
import { PackageOpen } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/_authenticated/sharing/")({
  head: () => ({
    meta: [
      { title: "Resource Sharing — CampusLife" },
      { name: "description", content: "Lend, sell or give away lab coats, calculators, books and drawing instruments on campus." },
      { property: "og:title", content: "Resource Sharing — CampusLife" },
      { property: "og:description", content: "Lend, sell or give away lab coats, calculators, books and drawing instruments on campus." },
    ],
  }),
  component: SharingPage,
});

function SharingPage() {
  return (
    <PlaceholderPage
      title="Resource Sharing"
      description="Browse academic items students are lending, selling or giving away."
      icon={PackageOpen}
    />
  );
}
