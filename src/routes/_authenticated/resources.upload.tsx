import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/resources/upload")({
  head: () => ({
    meta: [
      { title: "Upload a resource — CampusLife" },
      { name: "description", content: "Share your notes, question papers or useful links with other KRCT students." },
      { property: "og:title", content: "Upload a resource — CampusLife" },
      { property: "og:description", content: "Share your notes, question papers or useful links with other KRCT students." },
    ],
  }),
  component: ResourceUploadPage,
});

function ResourceUploadPage() {
  return (
    <PlaceholderPage
      title="Upload a resource"
      description="PDF uploads, link validation and subject tagging arrive with the resources module."
      icon={Upload}
    />
  );
}
