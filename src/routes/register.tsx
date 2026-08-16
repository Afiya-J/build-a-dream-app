import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRedirectIfAuthenticated } from "@/hooks/use-auth";
import { formatSemester, formatYear } from "@/lib/auth";
import { APP_NAME, DEPARTMENTS } from "@/lib/constants";
import { registerStudent } from "@/stores/auth-store";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — CampusLife" },
      {
        name: "description",
        content:
          "Register on CampusLife with your KRCT details to share resources, events and more.",
      },
      { property: "og:title", content: "Create your account — CampusLife" },
      {
        property: "og:description",
        content: "Register on CampusLife with your KRCT department, year and semester.",
      },
    ],
  }),
  component: RegisterPage,
});

const YEAR_OPTIONS = [1, 2, 3, 4] as const;
const SEMESTERS_FOR_YEAR: Record<number, readonly number[]> = {
  1: [1, 2],
  2: [3, 4],
  3: [5, 6],
  4: [7, 8],
};

interface FieldErrors {
  fullName?: string;
  registrationNumber?: string;
  department?: string;
  year?: string;
  semester?: string;
  password?: string;
  confirmPassword?: string;
}

function RegisterPage() {
  useRedirectIfAuthenticated();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const semesters = year ? (SEMESTERS_FOR_YEAR[Number(year)] ?? []) : [];

  function handleYearChange(value: string) {
    setYear(value);
    setSemester("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const next: FieldErrors = {};
    if (!fullName.trim()) next.fullName = "Full name is required";
    if (!registrationNumber.trim()) next.registrationNumber = "Registration number is required";
    if (!department) next.department = "Select your department";
    if (!year) next.year = "Select your year";
    if (!semester) next.semester = "Select your semester";
    if (password.length < 6) next.password = "Use at least 6 characters";
    if (!confirmPassword) next.confirmPassword = "Confirm your password";
    else if (confirmPassword !== password) next.confirmPassword = "Passwords do not match";

    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const { error } = await registerStudent({
      fullName,
      registrationNumber,
      department,
      year: Number(year),
      semester: Number(semester),
      password,
    });

    if (error) {
      setFormError(error);
      setSubmitting(false);
      return;
    }
    void navigate({ to: "/home", replace: true });
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-background px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="size-7" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Join {APP_NAME} with your college details
          </p>
        </div>

        <form
          className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1.5">
            <Label htmlFor="full-name">Full name</Label>
            <Input
              id="full-name"
              name="fullName"
              autoComplete="name"
              className="h-11"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={submitting}
            />
            <FormError message={errors.fullName} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-number">Registration number</Label>
            <Input
              id="reg-number"
              name="registrationNumber"
              inputMode="numeric"
              autoComplete="username"
              placeholder="e.g. 811722104001"
              className="h-11"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              disabled={submitting}
            />
            <FormError message={errors.registrationNumber} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department">Department</Label>
            <Select
              name="department"
              value={department}
              onValueChange={setDepartment}
              disabled={submitting}
            >
              <SelectTrigger id="department" className="h-11">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormError message={errors.department} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="year">Year</Label>
              <Select
                name="year"
                value={year}
                onValueChange={handleYearChange}
                disabled={submitting}
              >
                <SelectTrigger id="year" className="h-11">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {formatYear(y)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormError message={errors.year} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="semester">Semester</Label>
              <Select
                name="semester"
                value={semester}
                onValueChange={setSemester}
                disabled={!year || submitting}
              >
                <SelectTrigger id="semester" className="h-11">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={String(sem)}>
                      {formatSemester(sem)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormError message={errors.semester} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-password">Password</Label>
            <Input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
            <FormError message={errors.password} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
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

          <Button type="submit" className="h-11 w-full" disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" className="text-primary-foreground" />
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
