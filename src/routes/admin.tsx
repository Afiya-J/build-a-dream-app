import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — CampusLife" },
      { name: "description", content: "Moderation tools for CampusLife administrators." },
      { property: "og:title", content: "Admin — CampusLife" },
      { property: "og:description", content: "Moderation tools for CampusLife administrators." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <PlaceholderPage
      title="Admin panel"
      description="User, content moderation and statistics tools for administrators."
      icon={ShieldCheck}
    />
  );
}
