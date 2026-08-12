import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME, COLLEGE_NAME } from "@/lib/constants";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — CampusLife" },
      {
        name: "description",
        content: "Sign in to CampusLife with your KRCT registration number to access resources.",
      },
      { property: "og:title", content: "Sign in — CampusLife" },
      {
        property: "og:description",
        content: "Sign in to CampusLife with your KRCT registration number.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="size-7" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{COLLEGE_NAME}</p>
        </div>

        <form
          className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="space-y-1.5">
            <Label htmlFor="registration-number">Registration number</Label>
            <Input
              id="registration-number"
              name="registrationNumber"
              autoComplete="username"
              inputMode="numeric"
              placeholder="e.g. 811722104001"
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-11"
            />
          </div>

          <Button type="submit" className="h-11 w-full">
            Sign in
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New to {APP_NAME}?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
