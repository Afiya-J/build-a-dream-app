import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import type { TopBarProps } from "@/components/layout/TopBar";
import { mockUnreadMessageCount } from "@/data/mock";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  title?: string | undefined;
  showBrand?: boolean | undefined;
  backTo?: TopBarProps["backTo"];
  actions?: ReactNode;
  className?: string | undefined;
}


/** Shared chrome for authenticated screens: top bar, content area and navigation. */
export function AppShell({
  children,
  title,
  showBrand = false,
  backTo,
  actions,
  className,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background md:pl-60">
      <TopBar title={title} showBrand={showBrand} backTo={backTo} actions={actions} />
      <main className={cn("mx-auto max-w-3xl px-4 pb-28 pt-4 md:pb-12", className)}>
        {children}
      </main>
      <BottomNav unreadCount={mockUnreadMessageCount} />
    </div>
  );
}
