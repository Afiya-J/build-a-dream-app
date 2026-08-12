import { Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays, Home, MessageSquare, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: "/home" | "/resources" | "/events" | "/messages" | "/profile";
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/home", icon: Home },
  { label: "Resources", to: "/resources", icon: BookOpen },
  { label: "Events", to: "/events", icon: CalendarDays },
  { label: "Messages", to: "/messages", icon: MessageSquare },
  { label: "Profile", to: "/profile", icon: User },
];

interface BottomNavProps {
  unreadCount?: number;
}

function Badge({ count }: { count: number }) {
  return (
    <span
      aria-label={`${count} unread messages`}
      className="absolute -top-1 right-0 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold leading-4 text-danger-foreground"
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function BottomNav({ unreadCount = 0 }: BottomNavProps) {
  return (
    <>
      {/* Mobile: fixed bottom tab bar */}
      <nav
        aria-label="Main navigation"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden"
      >
        <ul className="mx-auto flex max-w-3xl items-stretch justify-between px-2">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="group flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
                activeProps={{ "aria-current": "page" }}
              >
                <span className="relative grid size-6 place-items-center">
                  <Icon className="size-5" aria-hidden="true" />
                  {label === "Messages" && unreadCount > 0 ? <Badge count={unreadCount} /> : null}
                </span>
                <span className="truncate">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tablet / desktop: side rail */}
      <nav
        aria-label="Main navigation"
        className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-card px-3 py-6 md:flex"
      >
        <span className="px-3 pb-6 text-lg font-bold tracking-tight text-primary">{APP_NAME}</span>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted",
                  "data-[status=active]:bg-accent data-[status=active]:text-accent-foreground",
                )}
                activeProps={{ "aria-current": "page" }}
              >
                <span className="relative grid size-6 shrink-0 place-items-center">
                  <Icon className="size-5" aria-hidden="true" />
                  {label === "Messages" && unreadCount > 0 ? <Badge count={unreadCount} /> : null}
                </span>
                <span className="truncate">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
