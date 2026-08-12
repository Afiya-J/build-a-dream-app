import { Link } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, User } from "lucide-react";
import type { ReactNode } from "react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  showBrand?: boolean;
  showProfile?: boolean;
  backTo?: string;
  actions?: ReactNode;
  className?: string;
}

export function TopBar({
  title,
  showBrand = false,
  showProfile = true,
  backTo,
  actions,
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80",
        className,
      )}
    >
      <div className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          {backTo ? (
            <Link
              to={backTo}
              aria-label="Go back"
              className="grid size-11 shrink-0 place-items-center rounded-xl text-secondary-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </Link>
          ) : null}
          {showBrand ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <span className="truncate text-lg font-bold tracking-tight text-primary">
                {APP_NAME}
              </span>
            </span>
          ) : (
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {actions}
          {showProfile ? (
            <Link
              to="/profile"
              aria-label="Open profile"
              className="grid size-11 place-items-center rounded-xl text-secondary-foreground transition-colors hover:bg-muted"
            >
              <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground">
                <User className="size-4" aria-hidden="true" />
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
