import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/messages/")({
  head: () => ({
    meta: [
      { title: "Messages — CampusLife" },
      { name: "description", content: "Your conversations about shared items and found belongings on CampusLife." },
      { property: "og:title", content: "Messages — CampusLife" },
      { property: "og:description", content: "Your conversations about shared items and found belongings on CampusLife." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <PlaceholderPage
      title="Messages"
      description="Conversations started from listings and found items appear here."
      icon={MessageCircle}
    />
  );
}
