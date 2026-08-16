import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  KeyRound,
  LogOut,
  PackageOpen,
  Search,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatSemester, formatYear } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/_authenticated/profile/")({
  head: () => ({
    meta: [
      { title: "Profile — CampusLife" },
      {
        name: "description",
        content: "Your CampusLife profile, uploads, listings, events and saved items.",
      },
      { property: "og:title", content: "Profile — CampusLife" },
      {
        property: "og:description",
        content: "Your CampusLife profile, uploads, listings, events and saved items.",
      },
    ],
  }),
  component: ProfilePage,
});

const ACTIVITY_SECTIONS = [
  { key: "resources", label: "My uploaded resources", icon: BookOpen },
  { key: "listings", label: "My listings", icon: PackageOpen },
  { key: "events", label: "My events", icon: CalendarDays },
  { key: "lost-found", label: "My lost & found posts", icon: Search },
] as const;

function initials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function ProfilePage() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await useAuthStore.getState().signOut();
    setSigningOut(false);
    setConfirmOpen(false);
    void navigate({ to: "/login", replace: true });
  }

  return (
    <AppShell title="Profile">
      {loading && !profile ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : !profile ? (
        <EmptyState
          icon={UserRound}
          title="Profile unavailable"
          description="We couldn't load your profile details. Please try again."
        />
      ) : (
        <>
          <section className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
              {initials(profile.full_name)}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight text-foreground">
                {profile.full_name}
              </h1>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {profile.registration_number}
              </p>
            </div>
          </section>

          <section
            aria-labelledby="academic-heading"
            className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <h2 id="academic-heading" className="text-sm font-semibold text-foreground">
              Academic details
            </h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Department</dt>
                <dd className="font-medium text-foreground">{profile.department}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Year</dt>
                <dd className="font-medium text-foreground">{formatYear(profile.year)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Semester</dt>
                <dd className="font-medium text-foreground">{formatSemester(profile.semester)}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="activity-heading" className="mt-6">
            <h2 id="activity-heading" className="mb-3 text-sm font-semibold text-foreground">
              My activity
            </h2>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {ACTIVITY_SECTIONS.map(({ key, label, icon: Icon }) => (
                <li key={key}>
                  <div className="flex min-h-11 items-center gap-3 px-4 py-3.5">
                    <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {label}
                    </span>
                    <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                      Coming soon
                    </span>
                  </div>
                </li>
              ))}
              <li>
                <Link
                  to="/events/saved"
                  className="flex min-h-11 items-center gap-3 px-4 py-3.5 hover:bg-accent/50"
                >
                  <CalendarDays
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    Saved events
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            </ul>
          </section>

          <section aria-labelledby="account-heading" className="mt-6">
            <h2 id="account-heading" className="mb-3 text-sm font-semibold text-foreground">
              Account
            </h2>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <li>
                <Link
                  to="/profile/change-password"
                  className="flex min-h-11 items-center gap-3 px-4 py-3.5 hover:bg-accent/50"
                >
                  <KeyRound className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    Change password
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            </ul>

            <Button
              variant="outline"
              className="mt-4 h-11 w-full text-danger"
              onClick={() => setConfirmOpen(true)}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Log out
            </Button>
          </section>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out of CampusLife?</AlertDialogTitle>
                <AlertDialogDescription>
                  You'll need your registration number and password to sign in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={signingOut}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault();
                    void handleSignOut();
                  }}
                  disabled={signingOut}
                >
                  {signingOut ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" className="text-primary-foreground" />
                      Logging out…
                    </span>
                  ) : (
                    "Log out"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </AppShell>
  );
}
