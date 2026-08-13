import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useRedirectIfAuthenticated } from "@/hooks/use-auth";
import { APP_NAME, COLLEGE_NAME } from "@/lib/constants";
import { signInWithRegistrationNumber } from "@/stores/auth-store";

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
  useRedirectIfAuthenticated();
  const navigate = useNavigate();

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ registrationNumber?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: typeof errors = {};
    if (!registrationNumber.trim()) nextErrors.registrationNumber = "Registration number is required";
    if (!password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const { error } = await signInWithRegistrationNumber(registrationNumber, password);
    if (error) {
      setFormError(error);
      setSubmitting(false);
      return;
    }
    void navigate({ to: "/home", replace: true });
  }

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
          onSubmit={handleSubmit}
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
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              disabled={submitting}
            />
            <FormError message={errors.registrationNumber} />
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
            <FormError message={errors.password} />
          </div>

          <FormError message={formError} />

          <Button type="submit" className="h-11 w-full" disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" className="text-primary-foreground" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
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
