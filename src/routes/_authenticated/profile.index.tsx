import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";

import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/_authenticated/profile/")({
  head: () => ({
    meta: [
      { title: "Profile — CampusLife" },
      { name: "description", content: "Your CampusLife profile, uploads, listings, events and saved items." },
      { property: "og:title", content: "Profile — CampusLife" },
      { property: "og:description", content: "Your CampusLife profile, uploads, listings, events and saved items." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <PlaceholderPage
      title="Profile"
      description="Your details, uploads, listings, saved events and account settings."
      icon={UserRound}
    />
  );
}
