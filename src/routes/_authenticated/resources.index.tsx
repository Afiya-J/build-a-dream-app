import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/resources/")({
  head: () => ({
    meta: [
      { title: "Study Resources — CampusLife" },
      { name: "description", content: "Browse handwritten notes, previous year question papers, videos and websites shared by KRCT students." },
      { property: "og:title", content: "Study Resources — CampusLife" },
      { property: "og:description", content: "Browse handwritten notes, previous year question papers, videos and websites shared by KRCT students." },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <PlaceholderPage
      title="Study Resources"
      description="Filter notes, PYQs, videos and websites by department, year, semester and subject."
      icon={BookOpen}
    />
  );
}
