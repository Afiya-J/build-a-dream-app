import { Link } from "@tanstack/react-router";
import { CalendarPlus, PackagePlus, Plus, Search, Upload, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  to: "/resources/upload" | "/sharing/create" | "/events/create" | "/lost-found/create";
  icon: LucideIcon;
}

const ACTIONS: QuickAction[] = [
  { label: "Upload Resource", to: "/resources/upload", icon: Upload },
  { label: "List an Item", to: "/sharing/create", icon: PackagePlus },
  { label: "Post Event", to: "/events/create", icon: CalendarPlus },
  { label: "Post Found Item", to: "/lost-found/create", icon: Search },
];

export function QuickActionFab() {
  const open = useUIStore((s) => s.fabOpen);
  const setOpen = useUIStore((s) => s.setFabOpen);

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2 md:bottom-8 md:right-8">
      {open ? (
        <>
          <button
            type="button"
            aria-label="Close quick actions"
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 cursor-default bg-foreground/20"
          />
          <ul className="flex flex-col items-end gap-2">
            {ACTIONS.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center gap-2 rounded-2xl border border-border bg-card py-2 pl-3 pr-4 text-sm font-medium text-foreground shadow-raised"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        className={cn(
          "grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-raised transition-colors hover:bg-primary-light",
        )}
      >
        {open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <Plus className="size-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
