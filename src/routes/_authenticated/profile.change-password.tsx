import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { AUTH_MESSAGES, registrationNumberToEmail } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile/change-password")({
  head: () => ({
    meta: [
      { title: "Change password — CampusLife" },
      { name: "description", content: "Update your CampusLife account password." },
      { property: "og:title", content: "Change password — CampusLife" },
      { property: "og:description", content: "Update your CampusLife account password." },
    ],
  }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const { profile } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const next: typeof errors = {};
    if (!currentPassword) next.currentPassword = "Enter your current password";
    if (newPassword.length < 6) next.newPassword = "Use at least 6 characters";
    if (confirmPassword !== newPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    setFormError(null);
    setSuccess(false);
    if (Object.keys(next).length > 0) return;

    if (!profile) {
      setFormError(AUTH_MESSAGES.generic);
      return;
    }

    setSubmitting(true);

    // Re-authenticate with the current password before allowing the change.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: registrationNumberToEmail(profile.registration_number),
      password: currentPassword,
    });
    if (reauthError) {
      setErrors({ currentPassword: "Your current password is incorrect" });
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setFormError(AUTH_MESSAGES.generic);
      setSubmitting(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess(true);
    setSubmitting(false);
  }

  return (
    <AppShell title="Change password" backTo="/profile">
      <form
        className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1.5">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            className="h-11"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={submitting}
          />
          <FormError message={errors.currentPassword} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            className="h-11"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={submitting}
          />
          <FormError message={errors.newPassword} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-new-password">Confirm new password</Label>
          <Input
            id="confirm-new-password"
            type="password"
            autoComplete="new-password"
            className="h-11"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={submitting}
          />
          <FormError message={errors.confirmPassword} />
        </div>

        <FormError message={formError} />

        {success ? (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>Your password has been updated.</span>
          </div>
        ) : null}

        <Button type="submit" className="h-11 w-full" disabled={submitting}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" className="text-primary-foreground" />
              Updating…
            </span>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </AppShell>
  );
}
