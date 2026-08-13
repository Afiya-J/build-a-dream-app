import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/profile/change-password")({
  head: () => ({
    meta: [
      { title: "Change password — CampusLife" },
      { name: "description", content: "Update your CampusLife account password." },
      { property: "og:title", content: "Change password — CampusLife" },
      { property: "og:description", content: "Update your CampusLife account password." },
    ],
  }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  return (
    <PlaceholderPage
      title="Change password"
      description="Password changes will be available once authentication is wired up."
      icon={KeyRound}
    />
  );
}
