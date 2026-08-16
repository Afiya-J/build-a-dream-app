import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import { APP_NAME, APP_TAGLINE, COLLEGE_SHORT_NAME } from "@/lib/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusLife — Your campus, organized." },
      {
        name: "description",
        content:
          "CampusLife is the KRCT student app for study resources, campus events, resource sharing and lost & found.",
      },
      { property: "og:title", content: "CampusLife — Your campus, organized." },
      {
        property: "og:description",
        content: "One organized platform for KRCT students: resources, events, sharing and more.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const { initialized, user } = useAuth();

  useEffect(() => {
    if (!initialized) return;
    void navigate({ to: user ? "/home" : "/login", replace: true });
  }, [initialized, user, navigate]);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-primary px-6 text-center">
      <span className="grid size-20 place-items-center rounded-3xl bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
        <GraduationCap className="size-10 text-primary-foreground" aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-primary-foreground/80">{APP_TAGLINE}</p>
      </div>
      <div
        role="status"
        aria-label="Loading CampusLife"
        className="mt-4 flex items-center gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 animate-bounce rounded-full bg-primary-foreground/70"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <p className="absolute bottom-8 text-xs font-medium tracking-wide text-primary-foreground/60">
        {COLLEGE_SHORT_NAME}
      </p>
    </main>
  );
}
