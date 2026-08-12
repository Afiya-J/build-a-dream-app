import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  note?: string;
  children?: ReactNode;
}

/** Polished stand-in for modules arriving in later phases. */
export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  note = "Coming in the next phase.",
  children,
}: PlaceholderPageProps) {
  return (
    <AppShell title={title}>
      <section className="rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-card">
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-7" aria-hidden="true" />
        </span>
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        <p className="mt-6 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-secondary-foreground">
          {note}
        </p>
        {children ? <div className="mt-6">{children}</div> : null}
      </section>
    </AppShell>
  );
}
