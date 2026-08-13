import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/messages/$conversationId")({
  head: () => ({
    meta: [
      { title: "Conversation — CampusLife" },
      { name: "description", content: "A one-to-one CampusLife conversation about a listing or found item." },
      { property: "og:title", content: "Conversation — CampusLife" },
      { property: "og:description", content: "A one-to-one CampusLife conversation about a listing or found item." },
    ],
  }),
  component: ConversationPage,
});

function ConversationPage() {
  return (
    <PlaceholderPage
      title="Conversation"
      description="Realtime one-to-one messaging arrives with the messaging module."
      icon={MessageCircle}
    />
  );
}
